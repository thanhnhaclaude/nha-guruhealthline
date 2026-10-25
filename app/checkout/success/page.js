import Link from "next/link";
import ClearCart from "@/components/shop/ClearCart";
import { afterPayment } from "@/lib/shop/complete";
import { dbEnabled, formatUsd, stripeEnabled } from "@/lib/shop/config";
import { getOrder, markPaid } from "@/lib/shop/orders";
import { sessionDetails, stripe } from "@/lib/shop/stripe";

export const dynamic = "force-dynamic";

export const metadata = { title: "Order Status", robots: { index: false, follow: false } };

const MESSAGES = {
  pending: ["Confirming your payment…", "This usually takes a few seconds. Refresh this page in a moment; you'll also get a confirmation email."],
  paid: ["Thank you, your order is confirmed!", "We've emailed your receipt. You'll get a tracking number as soon as your order ships (usually within 2–4 business days)."],
  fulfilling: ["Thank you, your order is being packed!", "You'll get a tracking number by email as soon as it ships."],
  needs_review: ["Thank you, we received your order.", "Our team is checking a detail on your order and will email you within one business day."],
  shipped: ["Your order has shipped!", "Check your email for the tracking link."],
  delivered: ["Your order was delivered.", "We hope you enjoy it."],
  cancelled: ["This order was cancelled.", "If you have questions, contact us."],
  refunded: ["This order was refunded.", "Refunds take 5–10 business days to appear on your statement."],
};

export default async function SuccessPage({ searchParams }) {
  const { order: id } = await searchParams;
  let order = dbEnabled() && typeof id === "string" && /^[0-9a-f-]{36}$/.test(id) ? await getOrder(id).catch(() => null) : null;
  // The webhook normally confirms Stripe payments; if it hasn't arrived yet, ask Stripe directly.
  if (order?.status === "pending" && order.provider === "stripe" && order.provider_ref && stripeEnabled()) {
    try {
      const session = await stripe().checkout.sessions.retrieve(order.provider_ref);
      if (session.payment_status === "paid" && (await markPaid(order.id, sessionDetails(session)))) await afterPayment(order.id);
      order = await getOrder(order.id);
    } catch (e) {
      console.error("[stripe] session check failed:", e.message);
    }
  }
  if (!order) {
    return (
      <div className="container page-head" style={{ maxWidth: "var(--prose)" }}>
        <h1>Order not found</h1>
        <p>We couldn&apos;t find that order. If you were charged, please <Link href="/contact/">contact us</Link> with your email address.</p>
      </div>
    );
  }
  const [title, text] = MESSAGES[order.status] || MESSAGES.paid;
  const paid = order.status !== "pending";
  return (
    <div className="container page-head" style={{ maxWidth: "var(--prose)" }}>
      {paid && <ClearCart />}
      {!paid && <meta httpEquiv="refresh" content="4" />}
      <p className="order-number">Order {order.number}</p>
      <h1>{title}</h1>
      <p>{text}</p>
      {order.tracking_number && (
        <p>
          Tracking: <strong>{order.tracking_carrier} {order.tracking_number}</strong>
          {order.tracking_url && (
            <>
              {" "}· <a href={order.tracking_url} rel="noopener noreferrer" target="_blank">Track package</a>
            </>
          )}
        </p>
      )}
      <table className="order-table">
        <tbody>
          {order.items.map((i) => (
            <tr key={i.slug}>
              <td>{i.name} × {i.qty}</td>
              <td>{formatUsd(i.lineCents)}</td>
            </tr>
          ))}
          <tr><td>Shipping</td><td>{order.shipping_cents ? formatUsd(order.shipping_cents) : "Free"}</td></tr>
          {order.tax_cents > 0 && <tr><td>Tax</td><td>{formatUsd(order.tax_cents)}</td></tr>}
          <tr className="order-total"><td>Total</td><td>{formatUsd(order.total_cents)}</td></tr>
        </tbody>
      </table>
      <p><Link href="/shop/" className="btn btn-outline">Continue shopping</Link></p>
    </div>
  );
}
