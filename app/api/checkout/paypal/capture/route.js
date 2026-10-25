import { NextResponse } from "next/server";
import { paypalEnabled } from "@/lib/shop/config";
import { afterPayment } from "@/lib/shop/complete";
import { getOrderByProviderRef, logEvent, markPaid } from "@/lib/shop/orders";
import { captureDetails, capturePaypalOrder } from "@/lib/shop/paypal";

export async function POST(req) {
  if (!paypalEnabled()) return NextResponse.json({ error: "PayPal is not available right now." }, { status: 503 });
  try {
    const { paypalOrderId } = await req.json();
    const order = typeof paypalOrderId === "string" ? await getOrderByProviderRef("paypal", paypalOrderId) : null;
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (order.status !== "pending") return NextResponse.json({ orderId: order.id });

    const d = captureDetails(await capturePaypalOrder(paypalOrderId, order.id));
    if (d.status !== "COMPLETED" || d.captureStatus !== "COMPLETED") {
      await logEvent(order.id, "payment_pending", `PayPal capture status ${d.captureStatus || d.status}`);
      return NextResponse.json({ error: "PayPal hasn't completed this payment yet. We'll email you once it does." }, { status: 402 });
    }
    // Trust only what PayPal reports: the amount and our order id must match.
    const problems = [];
    if (d.customId !== order.id) problems.push("order id mismatch");
    if (d.amountCents !== order.total_cents) problems.push(`amount ${d.amountCents} ≠ ${order.total_cents}`);
    if (d.address.country && d.address.country !== "US") problems.push(`ships to ${d.address.country}`);
    const status = problems.length ? "needs_review" : "paid";

    if (await markPaid(order.id, { ...d, status })) {
      if (problems.length) await logEvent(order.id, "review", problems.join("; "));
      else await afterPayment(order.id);
    }
    return NextResponse.json({ orderId: order.id });
  } catch (e) {
    console.error("[paypal] capture failed:", e);
    const declined = e.paypal?.details?.[0]?.issue === "INSTRUMENT_DECLINED";
    return NextResponse.json(
      { error: declined ? "Your payment method was declined. Please choose another one." : "Payment failed. Please try again.", restart: declined },
      { status: 500 },
    );
  }
}
