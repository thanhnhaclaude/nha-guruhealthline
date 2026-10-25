import nodemailer from "nodemailer";
import { COMPANY, COMPANY_ADDRESS, SITE_NAME, absoluteUrl } from "@/lib/site";
import { MAIL, formatUsd, mailEnabled } from "./config";

let transport;
function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: MAIL.host,
      port: MAIL.port,
      secure: MAIL.port === 465,
      auth: { user: MAIL.user, pass: MAIL.pass },
    });
  }
  return transport;
}

async function send({ to, subject, html, text, replyTo }) {
  if (!to) return;
  if (!mailEnabled()) {
    console.log(`[mail] SMTP not configured, skipped "${subject}" to ${to}`);
    return;
  }
  try {
    await getTransport().sendMail({ from: `${SITE_NAME} <${MAIL.from}>`, to, subject, html, text, replyTo });
  } catch (e) {
    // A failed email must never fail the order itself.
    console.error(`[mail] failed "${subject}" to ${to}:`, e.message);
  }
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function addressLines(a) {
  if (!a) return [];
  return [a.name, a.line1, a.line2, `${a.city || ""}, ${a.state || ""} ${a.postal_code || ""}`.trim(), a.country].filter(Boolean);
}

function itemsTable(order) {
  const rows = order.items
    .map((i) => `<tr><td style="padding:6px 0">${esc(i.name)} × ${i.qty}</td><td style="padding:6px 0;text-align:right">${formatUsd(i.lineCents)}</td></tr>`)
    .join("");
  const line = (label, cents, bold) =>
    `<tr><td style="padding:4px 0${bold ? ";font-weight:700" : ""}">${label}</td><td style="padding:4px 0;text-align:right${bold ? ";font-weight:700" : ""}">${cents === 0 && label === "Shipping" ? "Free" : formatUsd(cents)}</td></tr>`;
  return `<table style="width:100%;border-collapse:collapse;font-size:15px">${rows}
    <tr><td colspan="2" style="border-top:1px solid #e5e7eb"></td></tr>
    ${line("Subtotal", order.subtotal_cents)}${line("Shipping", order.shipping_cents)}${order.tax_cents ? line("Tax", order.tax_cents) : ""}${line("Total", order.total_cents, true)}</table>`;
}

function layout(title, inner) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
  <div style="background:#1a7a4a;color:#fff;padding:18px 24px;font-size:20px;font-weight:700">${SITE_NAME}</div>
  <div style="padding:24px"><h1 style="font-size:22px;margin:0 0 16px">${title}</h1>${inner}</div>
  <div style="padding:16px 24px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb">
  ${SITE_NAME} is operated by ${esc(COMPANY.legalName)}, ${esc(COMPANY_ADDRESS)}.<br>
  Questions? Reply to this email or write to ${esc(COMPANY.email)}.</div></div>`;
}

export async function sendOrderConfirmation(order) {
  const addr = addressLines(order.shipping_address).map(esc).join("<br>");
  const html = layout(
    `Thanks for your order, ${esc((order.name || "").split(" ")[0] || "friend")}!`,
    `<p>We received your payment for order <b>${order.number}</b>. We'll email you the tracking number as soon as it ships (usually within 2–4 business days).</p>
     ${itemsTable(order)}
     ${addr ? `<h2 style="font-size:16px;margin:24px 0 6px">Shipping to</h2><p style="margin:0">${addr}</p>` : ""}
     <p style="margin-top:24px"><a href="${absoluteUrl(`/checkout/success/`)}?order=${order.id}" style="color:#1a7a4a">View your order status</a></p>
     <p style="font-size:12px;color:#6b7280">These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>`,
  );
  await send({ to: order.email, subject: `Order ${order.number} confirmed`, html, replyTo: COMPANY.email });
}

export async function sendShippingNotice(order) {
  const track = order.tracking_url
    ? `<p><a href="${esc(order.tracking_url)}" style="color:#1a7a4a">Track your package</a></p>`
    : "";
  const html = layout(
    `Your order is on its way`,
    `<p>Order <b>${order.number}</b> has shipped${order.tracking_carrier ? ` with ${esc(order.tracking_carrier)}` : ""}.</p>
     ${order.tracking_number ? `<p>Tracking number: <b>${esc(order.tracking_number)}</b></p>` : ""}${track}
     ${itemsTable(order)}`,
  );
  await send({ to: order.email, subject: `Order ${order.number} has shipped`, html, replyTo: COMPANY.email });
}

export async function notifyAdmin(order, note) {
  const addr = addressLines(order.shipping_address).map(esc).join("<br>");
  const items = order.items.map((i) => `${esc(i.name)} × ${i.qty} (variant: ${esc(i.shopifyVariantId || "not set")})`).join("<br>");
  const html = layout(
    `New order ${order.number} · ${formatUsd(order.total_cents)}`,
    `<p>${esc(note)}</p><p><b>Paid with:</b> ${order.provider}<br><b>Customer:</b> ${esc(order.name)} · ${esc(order.email)} · ${esc(order.phone)}</p>
     <p><b>Items</b><br>${items}</p><p><b>Ship to</b><br>${addr}</p>
     <p><a href="${absoluteUrl(`/admin/orders/${order.id}/`)}" style="color:#1a7a4a">Open in admin</a></p>`,
  );
  await send({ to: MAIL.notify, subject: `[${SITE_NAME}] Order ${order.number} — ${note}`, html });
}
