import crypto from "node:crypto";
import { query } from "./db";

export const ORDER_STATUSES = ["pending", "paid", "fulfilling", "shipped", "delivered", "cancelled", "refunded", "needs_review"];

const parse = (s, d) => {
  try {
    return s ? JSON.parse(s) : d;
  } catch {
    return d;
  }
};

function hydrate(row) {
  if (!row) return null;
  return { ...row, items: parse(row.items, []), shipping_address: parse(row.shipping_address, null) };
}

function newNumber() {
  // GH-<yymmdd>-<4 random chars>: short enough to read over the phone.
  const d = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const r = crypto.randomBytes(3).toString("base64url").toUpperCase().replace(/[^A-Z0-9]/g, "X").slice(0, 4);
  return `GH-${d}-${r}`;
}

export async function createOrder({ provider, priced, email = null, phone = null }) {
  const id = crypto.randomUUID();
  const number = newNumber();
  await query(
    `INSERT INTO orders (id, number, provider, subtotal_cents, shipping_cents, total_cents, items, email, phone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, number, provider, priced.subtotalCents, priced.shippingCents, priced.totalCents, JSON.stringify(priced.items), email, phone],
  );
  await logEvent(id, "created", `Checkout started with ${provider}`);
  return { id, number };
}

export async function setProviderRef(id, ref) {
  await query("UPDATE orders SET provider_ref = ? WHERE id = ?", [ref, id]);
}

export async function getOrder(id) {
  const rows = await query("SELECT * FROM orders WHERE id = ?", [id]);
  return hydrate(rows[0]);
}

export async function getOrderByProviderRef(provider, ref) {
  const rows = await query("SELECT * FROM orders WHERE provider = ? AND provider_ref = ?", [provider, ref]);
  return hydrate(rows[0]);
}

export async function getOrderByFulfillmentRef(ref) {
  const rows = await query("SELECT * FROM orders WHERE fulfillment_ref = ?", [ref]);
  return hydrate(rows[0]);
}

export async function listOrders({ status, limit = 100 } = {}) {
  const lim = Math.max(1, Math.min(500, Number(limit) || 100));
  const rows = status
    ? await query(`SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT ${lim}`, [status])
    : await query(`SELECT * FROM orders WHERE status <> 'pending' ORDER BY created_at DESC LIMIT ${lim}`);
  return rows.map(hydrate);
}

/**
 * Records a confirmed payment. Returns true only for the call that moved the
 * order out of "pending", so emails and fulfillment run once even when the
 * payment provider retries.
 */
export async function markPaid(id, { paymentRef, email, phone, name, address, taxCents = 0, totalCents, status = "paid" }) {
  const res = await query(
    `UPDATE orders SET status = ?, payment_ref = ?, email = COALESCE(?, email), phone = COALESCE(?, phone),
       name = ?, shipping_address = ?, tax_cents = ?, total_cents = COALESCE(?, total_cents), paid_at = UTC_TIMESTAMP()
     WHERE id = ? AND status = 'pending'`,
    [status, paymentRef, email || null, phone || null, name || null, JSON.stringify(address || null), taxCents, totalCents ?? null, id],
  );
  if (res.affectedRows === 1) {
    await logEvent(id, "paid", `Payment ${paymentRef} confirmed`);
    return true;
  }
  return false;
}

export async function updateOrder(id, fields) {
  const allowed = ["status", "fulfillment_status", "fulfillment_ref", "fulfillment_error", "tracking_number", "tracking_carrier", "tracking_url"];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (keys.length === 0) return;
  const sets = keys.map((k) => `${k} = ?`);
  if (fields.status === "shipped") sets.push("shipped_at = COALESCE(shipped_at, UTC_TIMESTAMP())");
  await query(`UPDATE orders SET ${sets.join(", ")} WHERE id = ?`, [...keys.map((k) => fields[k] ?? null), id]);
}

export async function logEvent(orderId, type, message = null) {
  await query("INSERT INTO order_events (order_id, type, message) VALUES (?, ?, ?)", [orderId, type, message]);
}

export async function getEvents(orderId) {
  return query("SELECT * FROM order_events WHERE order_id = ? ORDER BY id", [orderId]);
}

export async function orderStats() {
  const rows = await query(
    `SELECT status, COUNT(*) AS n, COALESCE(SUM(total_cents), 0) AS cents FROM orders WHERE status <> 'pending' GROUP BY status`,
  );
  return rows;
}
