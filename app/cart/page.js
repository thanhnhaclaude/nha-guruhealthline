import { Breadcrumbs } from "@/components/ArticleParts";
import CartView from "@/components/shop/CartView";
import { PAYPAL, SHIPPING, dbEnabled, paypalEnabled, stripeEnabled } from "@/lib/shop/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Cart",
  robots: { index: false, follow: false },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  const ready = dbEnabled();
  return (
    <div className="container page-head">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Cart" }]} />
      <h1>Your cart</h1>
      <CartView
        stripeOn={ready && stripeEnabled()}
        paypalClientId={ready && paypalEnabled() ? PAYPAL.clientId : ""}
        freeFromCents={SHIPPING.freeFromCents}
        flatCents={SHIPPING.flatCents}
      />
    </div>
  );
}
