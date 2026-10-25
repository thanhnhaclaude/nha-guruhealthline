import Link from "next/link";
import { requireAdmin } from "@/lib/shop/admin-auth";
import { notFound } from "next/navigation";
import { formatUsd } from "@/lib/shop/config";
import { ORDER_STATUSES, getEvents, getOrder } from "@/lib/shop/orders";
import { retryFulfillment, saveOrder } from "../../../actions";

export default async function AdminOrder({ params }) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const events = await getEvents(id);
  const a = order.shipping_address || {};

  return (
    <>
      <p><Link href="/admin/">← All orders</Link></p>
      <h1>Order {order.number}</h1>
      <p>
        <span className={`status s-${order.status}`}>{order.status.replace("_", " ")}</span> · paid with {order.provider} · payment{" "}
        <code>{order.payment_ref || "—"}</code>
      </p>
      {order.fulfillment_error && <p className="form-error">{order.fulfillment_error}</p>}

      <div className="admin-cols">
        <section>
          <h2>Items</h2>
          <table className="admin-table">
            <tbody>
              {order.items.map((i) => (
                <tr key={i.slug}>
                  <td>{i.name} × {i.qty}<br /><span className="muted small">{i.shopifyVariantId || "no Shopify variant"}</span></td>
                  <td>{formatUsd(i.lineCents)}</td>
                </tr>
              ))}
              <tr><td>Shipping</td><td>{formatUsd(order.shipping_cents)}</td></tr>
              <tr><td>Tax</td><td>{formatUsd(order.tax_cents)}</td></tr>
              <tr><th>Total</th><th>{formatUsd(order.total_cents)}</th></tr>
            </tbody>
          </table>
          <h2>Customer</h2>
          <p>
            {order.name}<br />
            {order.email}<br />
            {order.phone || a.phone}
          </p>
          <h2>Ship to</h2>
          <p>
            {a.name}<br />
            {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
            {a.city}, {a.state} {a.postal_code}<br />
            {a.country}
          </p>
        </section>

        <section>
          <h2>Fulfillment</h2>
          <p>Status: <strong>{order.fulfillment_status}</strong>{order.fulfillment_ref && <> · <code>{order.fulfillment_ref}</code></>}</p>
          {order.status !== "pending" && order.fulfillment_status !== "submitted" && order.fulfillment_status !== "fulfilled" && (
            <form action={retryFulfillment}>
              <input type="hidden" name="id" value={order.id} />
              <button className="btn btn-outline">Send to Supliful (Shopify) again</button>
            </form>
          )}
          <h2>Update order</h2>
          <form action={saveOrder} className="admin-form">
            <input type="hidden" name="id" value={order.id} />
            <label className="field">
              <span>Status</span>
              <select name="status" defaultValue={order.status}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </label>
            <label className="field"><span>Carrier</span><input name="tracking_carrier" defaultValue={order.tracking_carrier || ""} placeholder="USPS, UPS, FedEx" /></label>
            <label className="field"><span>Tracking number</span><input name="tracking_number" defaultValue={order.tracking_number || ""} /></label>
            <label className="field"><span>Tracking URL (https://…)</span><input name="tracking_url" type="url" defaultValue={order.tracking_url || ""} /></label>
            <label className="check"><input type="checkbox" name="notify" /> Email the tracking details to the customer</label>
            <button className="btn btn-primary">Save</button>
          </form>
          <p className="muted small">Refunds are issued in the Stripe or PayPal dashboard; Stripe refunds update this order automatically.</p>
        </section>
      </div>

      <h2>History</h2>
      <ol className="admin-events">
        {events.map((e) => (
          <li key={e.id}><span className="muted small">{e.created_at} UTC</span> · <strong>{e.type}</strong> {e.message}</li>
        ))}
      </ol>
    </>
  );
}
