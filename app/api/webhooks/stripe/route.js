import { NextResponse } from "next/server";
import { STRIPE, stripeEnabled } from "@/lib/shop/config";
import { afterPayment } from "@/lib/shop/complete";
import { query } from "@/lib/shop/db";
import { getOrder, logEvent, markPaid, updateOrder } from "@/lib/shop/orders";
import { sessionDetails, stripe } from "@/lib/shop/stripe";

// Stripe Dashboard → Developers → Webhooks → endpoint
//   https://guruhealthline.com/api/webhooks/stripe/   (keep the trailing slash)
// Events: checkout.session.completed, checkout.session.async_payment_succeeded, charge.refunded
export async function POST(req) {
  if (!stripeEnabled() || !STRIPE.webhookSecret) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const raw = await req.text();
  let event;
  try {
    event = stripe().webhooks.constructEvent(raw, req.headers.get("stripe-signature"), STRIPE.webhookSecret);
  } catch (e) {
    console.warn("[stripe] webhook signature rejected:", e.message);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  try {
    const obj = event.data.object;
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const orderId = obj.metadata?.order_id || obj.client_reference_id;
      const order = orderId && (await getOrder(orderId));
      if (!order) return NextResponse.json({ received: true, note: "unknown order" });
      if (obj.payment_status !== "paid") {
        await logEvent(order.id, "payment_pending", `Stripe payment status: ${obj.payment_status}`);
      } else if (await markPaid(order.id, sessionDetails(obj))) {
        await afterPayment(order.id);
      }
    } else if (event.type === "charge.refunded") {
      const pi = typeof obj.payment_intent === "string" ? obj.payment_intent : obj.payment_intent?.id;
      const rows = pi ? await query("SELECT id FROM orders WHERE payment_ref = ?", [pi]) : [];
      if (rows[0]) {
        if (obj.refunded) await updateOrder(rows[0].id, { status: "refunded" });
        await logEvent(rows[0].id, "refund", `Refunded ${(obj.amount_refunded / 100).toFixed(2)} USD in Stripe`);
      }
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[stripe] webhook failed:", e);
    // 500 makes Stripe retry later.
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
