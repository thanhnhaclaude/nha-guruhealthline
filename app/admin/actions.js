"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/lib/shop/admin-auth";
import { query } from "@/lib/shop/db";
import { sendShippingNotice } from "@/lib/shop/email";
import { submitFulfillment } from "@/lib/shop/fulfillment";
import { ORDER_STATUSES, getOrder, logEvent, updateOrder } from "@/lib/shop/orders";

const attempts = new Map(); // ip-less, process-wide throttle against password guessing

export async function login(_prev, formData) {
  const now = Date.now();
  const a = attempts.get("all") || { n: 0, until: 0 };
  if (a.until > now) return { error: "Too many attempts. Wait a minute and try again." };
  if (!passwordMatches(String(formData.get("password") || ""))) {
    a.n += 1;
    if (a.n >= 5) Object.assign(a, { n: 0, until: now + 60_000 });
    attempts.set("all", a);
    return { error: "Wrong password." };
  }
  attempts.delete("all");
  await startSession();
  redirect("/admin/");
}

export async function logout() {
  await endSession();
  redirect("/admin/login/");
}

export async function saveOrder(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const order = await getOrder(id);
  if (!order) return;
  const status = String(formData.get("status"));
  const fields = {
    status: ORDER_STATUSES.includes(status) ? status : order.status,
    tracking_number: String(formData.get("tracking_number") || "").trim() || null,
    tracking_carrier: String(formData.get("tracking_carrier") || "").trim() || null,
    tracking_url: String(formData.get("tracking_url") || "").trim() || null,
  };
  if (fields.tracking_url && !/^https:\/\//.test(fields.tracking_url)) fields.tracking_url = null;
  await updateOrder(id, fields);
  const changes = Object.entries(fields).filter(([k, v]) => (order[k] ?? null) !== v).map(([k, v]) => `${k}=${v ?? "—"}`);
  if (changes.length) await logEvent(id, "admin_update", changes.join(", "));
  if (formData.get("notify") === "on" && fields.tracking_number) {
    await sendShippingNotice({ ...order, ...fields });
    await logEvent(id, "email", "Shipping email sent to customer");
  }
  revalidatePath(`/admin/orders/${id}/`);
}

export async function retryFulfillment(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const order = await getOrder(id);
  if (!order || order.status === "pending") return;
  await submitFulfillment(order);
  revalidatePath(`/admin/orders/${id}/`);
}

const cents = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Math.round(Number(s) * 100);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export async function saveProduct(formData) {
  await requireAdmin();
  const slug = String(formData.get("slug"));
  const variant = String(formData.get("shopify_variant_id") || "").trim();
  if (variant && !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(variant)) return;
  await query(
    `INSERT INTO product_settings (slug, price_cents, compare_at_cents, active, shopify_variant_id) VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE price_cents = VALUES(price_cents), compare_at_cents = VALUES(compare_at_cents), active = VALUES(active), shopify_variant_id = VALUES(shopify_variant_id)`,
    [slug, cents(formData.get("price")), cents(formData.get("compare_at")), formData.get("active") === "on" ? 1 : 0, variant || null],
  );
  revalidatePath("/admin/products/");
}
