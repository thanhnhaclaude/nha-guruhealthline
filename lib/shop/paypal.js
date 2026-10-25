import { SITE_NAME } from "@/lib/site";
import { PAYPAL } from "./config";

// PayPal REST API v2 (Orders), called directly with fetch: no SDK needed.

let cached = { token: null, exp: 0 };

async function accessToken() {
  if (cached.token && Date.now() < cached.exp) return cached.token;
  const res = await fetch(`${PAYPAL.apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${PAYPAL.clientId}:${PAYPAL.clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed (${res.status})`);
  const data = await res.json();
  cached = { token: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return cached.token;
}

async function call(path, { method = "GET", body, requestId } = {}) {
  const res = await fetch(`${PAYPAL.apiBase}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
      ...(requestId ? { "PayPal-Request-Id": requestId } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.details?.[0]?.issue || data?.name || res.status;
    const err = new Error(`PayPal ${method} ${path} failed: ${detail}`);
    err.paypal = data;
    throw err;
  }
  return data;
}

const usd = (cents) => (cents / 100).toFixed(2);

export async function createPaypalOrder(order, priced) {
  return call("/v2/checkout/orders", {
    method: "POST",
    requestId: `create-${order.id}`,
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.number,
          custom_id: order.id,
          invoice_id: order.number,
          description: `${SITE_NAME} order ${order.number}`,
          amount: {
            currency_code: "USD",
            value: usd(priced.totalCents),
            breakdown: { item_total: { currency_code: "USD", value: usd(priced.subtotalCents) }, shipping: { currency_code: "USD", value: usd(priced.shippingCents) } },
          },
          items: priced.items.map((i) => ({ name: i.name.slice(0, 127), sku: i.slug, quantity: String(i.qty), unit_amount: { currency_code: "USD", value: usd(i.unitCents) }, category: "PHYSICAL_GOODS" })),
        },
      ],
      payment_source: {
        paypal: { experience_context: { brand_name: SITE_NAME, shipping_preference: "GET_FROM_FILE", user_action: "PAY_NOW" } },
      },
    },
  });
}

export async function capturePaypalOrder(paypalOrderId, orderId) {
  return call(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, { method: "POST", requestId: `capture-${orderId}` });
}

/** Normalizes a captured PayPal order into our order fields. */
export function captureDetails(data) {
  const pu = data.purchase_units?.[0] || {};
  const cap = pu.payments?.captures?.[0] || {};
  const a = pu.shipping?.address || {};
  const name = pu.shipping?.name?.full_name || [data.payer?.name?.given_name, data.payer?.name?.surname].filter(Boolean).join(" ");
  return {
    status: data.status,
    captureStatus: cap.status,
    amountCents: Math.round(Number(cap.amount?.value || 0) * 100),
    customId: pu.custom_id || cap.custom_id,
    paymentRef: cap.id,
    email: data.payer?.email_address,
    phone: data.payer?.phone?.phone_number?.national_number,
    name,
    address: { name, line1: a.address_line_1, line2: a.address_line_2, city: a.admin_area_2, state: a.admin_area_1, postal_code: a.postal_code, country: a.country_code },
  };
}
