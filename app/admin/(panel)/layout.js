import Link from "next/link";
import { requireAdmin } from "@/lib/shop/admin-auth";
import { dbEnabled, mailEnabled, paypalEnabled, shopifyEnabled, stripeEnabled, stripeLive, PAYPAL } from "@/lib/shop/config";
import { logout } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Store admin", robots: { index: false, follow: false } };

function Flag({ on, label, detail }) {
  return <li className={on ? "ok" : "off"}>{on ? "●" : "○"} {label}{detail ? ` (${detail})` : ""}</li>;
}

export default async function AdminLayout({ children }) {
  await requireAdmin();
  return (
    <div className="container page-head admin">
      <div className="admin-bar">
        <nav aria-label="Admin">
          <Link href="/admin/">Orders</Link>
          <Link href="/admin/products/">Products</Link>
          <Link href="/shop/">View shop</Link>
        </nav>
        <form action={logout}>
          <button className="linklike">Sign out</button>
        </form>
      </div>
      <ul className="admin-flags" aria-label="Integrations">
        <Flag on={dbEnabled()} label="Database" />
        <Flag on={stripeEnabled()} label="Stripe" detail={stripeEnabled() ? (stripeLive() ? "live" : "test") : ""} />
        <Flag on={paypalEnabled()} label="PayPal" detail={paypalEnabled() ? (PAYPAL.live ? "live" : "sandbox") : ""} />
        <Flag on={shopifyEnabled()} label="Supliful via Shopify" detail={shopifyEnabled() ? "" : "manual fulfillment"} />
        <Flag on={mailEnabled()} label="Email" />
      </ul>
      {children}
    </div>
  );
}
