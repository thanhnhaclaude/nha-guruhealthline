import crypto from "node:crypto";
import { SHOPIFY, shopifyEnabled } from "./config";
import { logEvent, updateOrder } from "./orders";

// Supliful fulfills orders that arrive in a connected Shopify store whose
// products were published with "Publish to Shopify". We create the paid order
// there through the GraphQL Admin API; Shopify's automatic fulfillment then
// routes it to Supliful. Without Shopify credentials the order is left for
// manual handling and the owner is emailed.

async function shopifyGraphql(queryText, variables) {
  const res = await fetch(`https://${SHOPIFY.domain}/admin/api/${SHOPIFY.apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "X-Shopify-Access-Token": SHOPIFY.token, "Content-Type": "application/json" },
    body: JSON.stringify({ query: queryText, variables }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.errors) throw new Error(`Shopify API ${res.status}: ${JSON.stringify(data.errors || data).slice(0, 300)}`);
  return data.data;
}

const ORDER_CREATE = `mutation CreateOrder($order: OrderCreateOrderInput!) {
  orderCreate(order: $order) { order { id name } userErrors { field message } }
}`;

function splitName(full = "") {
  const parts = full.trim().split(/\s+/);
  return { firstName: parts.slice(0, -1).join(" ") || parts[0] || "", lastName: parts.length > 1 ? parts.at(-1) : "" };
}

function toE164(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return phone ? `+${digits}` : undefined;
}

export function shopifyOrderInput(order) {
  const a = order.shipping_address || {};
  const phone = toE164(order.phone || a.phone);
  const address = {
    ...splitName(a.name || order.name),
    address1: a.line1,
    address2: a.line2 || undefined,
    city: a.city,
    provinceCode: a.state,
    countryCode: a.country || "US",
    zip: a.postal_code,
    phone,
  };
  return {
    lineItems: order.items.map((i) => ({ variantId: i.shopifyVariantId, quantity: i.qty })),
    shippingAddress: address,
    billingAddress: address,
    email: order.email,
    phone,
    note: `Order from guruhealthline.com - Order ID: ${order.number}`,
    financialStatus: "PAID",
    sendReceipt: false,
    sendFulfillmentReceipt: false,
    customAttributes: [{ key: "internal_order_id", value: order.number }],
  };
}

/** Returns a short note about what happened, for the admin email. */
export async function submitFulfillment(order) {
  if (!shopifyEnabled()) {
    await updateOrder(order.id, { fulfillment_status: "manual" });
    await logEvent(order.id, "fulfillment", "Shopify not connected: place this order in Supliful manually");
    return "Place this order with Supliful manually (Shopify is not connected yet).";
  }
  const missing = order.items.filter((i) => !i.shopifyVariantId).map((i) => i.name);
  const problems = [];
  if (missing.length) problems.push(`no Shopify variant ID for ${missing.join(", ")}`);
  if (!order.email || !(order.phone || order.shipping_address?.phone)) problems.push("missing customer email or phone (Supliful declines these)");
  if (problems.length) {
    const msg = `Not sent to Shopify: ${problems.join("; ")}`;
    await updateOrder(order.id, { fulfillment_status: "error", fulfillment_error: msg, status: "needs_review" });
    await logEvent(order.id, "fulfillment_error", msg);
    return msg;
  }
  try {
    const data = await shopifyGraphql(ORDER_CREATE, { order: shopifyOrderInput(order) });
    const errs = data.orderCreate.userErrors;
    if (errs?.length) throw new Error(errs.map((e) => e.message).join("; "));
    const created = data.orderCreate.order;
    await updateOrder(order.id, { fulfillment_status: "submitted", fulfillment_ref: created.id, fulfillment_error: null, status: "fulfilling" });
    await logEvent(order.id, "fulfillment", `Created Shopify order ${created.name} for Supliful`);
    return `Sent to Supliful through Shopify (${created.name}).`;
  } catch (e) {
    await updateOrder(order.id, { fulfillment_status: "error", fulfillment_error: e.message, status: "needs_review" });
    await logEvent(order.id, "fulfillment_error", e.message);
    return `Shopify order creation failed: ${e.message}`;
  }
}

export function verifyShopifyHmac(rawBody, hmacHeader) {
  if (!SHOPIFY.webhookSecret || !hmacHeader) return false;
  const digest = crypto.createHmac("sha256", SHOPIFY.webhookSecret).update(rawBody, "utf8").digest();
  const given = Buffer.from(hmacHeader, "base64");
  return given.length === digest.length && crypto.timingSafeEqual(given, digest);
}
