import Link from "next/link";
import { Breadcrumbs } from "@/components/ArticleParts";
import ShopCard from "@/components/shop/ShopCard";
import { SHIPPING, formatUsd } from "@/lib/shop/config";
import { getProducts } from "@/lib/shop/products";

// Prices and availability come from the database, so render per request.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop Supplements: GuruHealthline Store",
  description: `Shop GuruHealthline supplements, each linked to our evidence-based ingredient guides. Free US shipping on orders over ${formatUsd(SHIPPING.freeFromCents)}.`,
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();
  const allSamples = products.length > 0 && products.every((p) => p.sample);
  return (
    <div className="container page-head">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <h1>Shop supplements</h1>
      <p className="sec-sub">
        Every product links to our ingredient guide, so you can check the research before you buy. Free US shipping on orders over{" "}
        {formatUsd(SHIPPING.freeFromCents)}.
      </p>
      <ul className="shop-perks">
        <li>🚚 Ships from US warehouses in 2–4 business days</li>
        <li>🔒 Secure checkout with card, Apple Pay, Google Pay or PayPal</li>
        <li>↩️ <Link href="/returns-refunds/">30-day returns on unopened items</Link></li>
      </ul>
      {allSamples && (
        <p className="shop-note">
          Sample catalog: these listings show the store layout. Real products, label details and prices are added before launch.
        </p>
      )}
      <div className="shop-grid">
        {products.map((p) => (
          <ShopCard key={p.slug} product={p} />
        ))}
      </div>
      <p className="disclaimer small muted" style={{ marginTop: 32 }}>
        These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or
        prevent any disease.
      </p>
    </div>
  );
}
