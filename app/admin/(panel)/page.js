import Link from "next/link";
import { requireAdmin } from "@/lib/shop/admin-auth";
import { dbEnabled, formatUsd } from "@/lib/shop/config";
import { ORDER_STATUSES, listOrders, orderStats } from "@/lib/shop/orders";

const when = (s) => (s ? `${s.slice(0, 16).replace("T", " ")} UTC` : "");

export default async function AdminOrders({ searchParams }) {
  await requireAdmin();
  if (!dbEnabled()) return <p className="shop-note">Set DATABASE_URL to start taking orders.</p>;
  const { status } = await searchParams;
  const filter = ORDER_STATUSES.includes(status) ? status : undefined;
  const [orders, stats] = await Promise.all([listOrders({ status: filter }), orderStats()]);
  const paidStatuses = ["paid", "fulfilling", "shipped", "delivered", "needs_review"];
  const revenue = stats.filter((s) => paidStatuses.includes(s.status)).reduce((t, s) => t + Number(s.cents), 0);
  const count = (st) => Number(stats.find((s) => s.status === st)?.n || 0);

  return (
    <>
      <h1>Orders</h1>
      <div className="admin-stats">
        <div><strong>{formatUsd(revenue)}</strong><span>Paid revenue</span></div>
        <div><strong>{count("paid") + count("fulfilling")}</strong><span>To ship</span></div>
        <div><strong>{count("needs_review")}</strong><span>Needs review</span></div>
        <div><strong>{count("shipped") + count("delivered")}</strong><span>Shipped</span></div>
      </div>
      <nav className="admin-filter" aria-label="Filter by status">
        <Link href="/admin/" aria-current={!filter ? "page" : undefined}>All paid</Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={`/admin/?status=${s}`} aria-current={filter === s ? "page" : undefined}>{s.replace("_", " ")}</Link>
        ))}
      </nav>
      {orders.length === 0 ? (
        <p className="muted">No orders yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Date</th><th>Customer</th><th>Total</th><th>Paid with</th><th>Status</th><th>Fulfillment</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><Link href={`/admin/orders/${o.id}/`}>{o.number}</Link></td>
                  <td>{when(o.paid_at || o.created_at)}</td>
                  <td>{o.name || "—"}<br /><span className="muted small">{o.email}</span></td>
                  <td>{formatUsd(o.total_cents)}</td>
                  <td>{o.provider}</td>
                  <td><span className={`status s-${o.status}`}>{o.status.replace("_", " ")}</span></td>
                  <td>{o.fulfillment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
