import { NextResponse } from "next/server";
import { claimWebhookEvent, releaseWebhookEvent } from "@/lib/shop/db";
import { sendShippingNotice } from "@/lib/shop/email";
import { verifyShopifyHmac } from "@/lib/shop/fulfillment";
import { getOrderByFulfillmentRef, logEvent, updateOrder } from "@/lib/shop/orders";

// Shipping updates from Supliful arrive as Shopify webhooks.
// Shopify admin → Settings → Notifications → Webhooks (or the custom app):
//   https://guruhealthline.com/api/webhooks/shopify/   (JSON, keep the trailing slash)
// Topics: Fulfillment creation, Fulfillment update, Order cancellation.
export async function POST(req) {
  const raw = await req.text();
  if (!verifyShopifyHmac(raw, req.headers.get("x-shopify-hmac-sha256"))) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  const topic = req.headers.get("x-shopify-topic") || "";
  const webhookId = req.headers.get("x-shopify-webhook-id");
  const key = webhookId && `shopify:${webhookId}`;
  if (key && !(await claimWebhookEvent(key))) return NextResponse.json({ duplicate: true });
  try {
    return await handle(topic, JSON.parse(raw));
  } catch (e) {
    console.error("[shopify] webhook failed:", e);
    if (key) await releaseWebhookEvent(key); // let Shopify's retry run it again
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}

async function handle(topic, body) {
  const shopifyOrderId = topic.startsWith("fulfillments/") ? body.order_id : body.id;
  const order = shopifyOrderId ? await getOrderByFulfillmentRef(`gid://shopify/Order/${shopifyOrderId}`) : null;
  if (!order) return NextResponse.json({ received: true, note: "order not from this site" });

  if (topic.startsWith("fulfillments/")) {
    const tracking = {
      tracking_number: body.tracking_number || body.tracking_numbers?.[0] || null,
      tracking_carrier: body.tracking_company || null,
      tracking_url: body.tracking_url || body.tracking_urls?.[0] || null,
    };
    const delivered = body.shipment_status === "delivered";
    const newlyShipped = order.status !== "shipped" && order.status !== "delivered" && tracking.tracking_number;
    await updateOrder(order.id, { ...tracking, fulfillment_status: "fulfilled", status: delivered ? "delivered" : tracking.tracking_number ? "shipped" : order.status });
    await logEvent(order.id, "shipment", `${topic}: ${tracking.tracking_carrier || ""} ${tracking.tracking_number || "no tracking yet"} ${body.shipment_status || ""}`.trim());
    if (newlyShipped) await sendShippingNotice({ ...order, ...tracking });
  } else if (topic === "orders/cancelled") {
    await updateOrder(order.id, { status: "needs_review", fulfillment_status: "cancelled" });
    await logEvent(order.id, "fulfillment_cancelled", `Cancelled in Shopify: ${body.cancel_reason || "no reason given"}. Refund the customer if needed.`);
  }
  return NextResponse.json({ received: true });
}
