import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, breadcrumbSchema } from "@/components/ArticleParts";
import JsonLd from "@/components/JsonLd";
import AddToCart from "@/components/shop/AddToCart";
import Bottle from "@/components/shop/Bottle";
import ShopCard from "@/components/shop/ShopCard";
import { getAllProductDocs, getIngredient, renderMarkdown } from "@/lib/content";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { SHIPPING, formatUsd } from "@/lib/shop/config";
import { getProduct, getProducts } from "@/lib/shop/products";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = getAllProductDocs().find((d) => d.slug === slug);
  if (!doc) return {};
  return {
    title: `${doc.name}: ${doc.form}`,
    description: doc.description,
    alternates: { canonical: `/shop/${slug}` },
    // Sample listings are placeholders: keep them out of search.
    ...(doc.sample ? { robots: { index: false, follow: true } } : {}),
  };
}

function productSchema(p) {
  const url = absoluteUrl(`/shop/${p.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.slug,
    brand: { "@type": "Brand", name: SITE_NAME },
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      price: (p.priceCents / 100).toFixed(2),
      availability: p.active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: (p.priceCents >= SHIPPING.freeFromCents ? 0 : SHIPPING.flatCents / 100).toFixed(2), currency: "USD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  const html = await renderMarkdown(p.body);
  const ingredient = p.ingredient ? getIngredient(p.ingredient) : null;
  const topics = p.topics.map(getTopic).filter(Boolean);
  const related = (await getProducts()).filter((o) => o.slug !== p.slug && o.topics.some((t) => p.topics.includes(t))).slice(0, 3);
  const crumbs = [{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: p.shortName }];
  const freeShip = p.priceCents >= SHIPPING.freeFromCents;

  return (
    <div className="container page-head">
      {!p.sample && <JsonLd data={productSchema(p)} />}
      <JsonLd data={breadcrumbSchema(crumbs, absoluteUrl)} />
      <Breadcrumbs items={crumbs} />
      <div className="pdp">
        <div className="pdp-media">
          <Bottle product={p} size={360} />
        </div>
        <div className="pdp-info">
          {p.goal && <span className="shop-goal">{p.goal}</span>}
          <h1>{p.name}</h1>
          <p className="pdp-meta">{[p.form, p.size, p.servings].filter(Boolean).join(" · ")}</p>
          <p className="pdp-price">
            {formatUsd(p.priceCents)}
            {p.compareAtCents > p.priceCents && <s>{formatUsd(p.compareAtCents)}</s>}
          </p>
          {p.sample && <p className="shop-note">Sample listing: label details and price will be updated before launch.</p>}
          <AddToCart
            product={{ slug: p.slug, name: p.name, shortName: p.shortName, form: p.form, color: p.color, priceCents: p.priceCents }}
            disabled={!p.active}
          />
          <ul className="pdp-perks">
            <li>🚚 {freeShip ? "Free US shipping" : `Free US shipping on orders over ${formatUsd(SHIPPING.freeFromCents)} (otherwise ${formatUsd(SHIPPING.flatCents)})`}</li>
            <li>📦 Ships in 2–4 business days from a US warehouse</li>
            <li>↩️ <Link href="/returns-refunds/">30-day returns on unopened items</Link></li>
          </ul>
          {ingredient && (
            <p className="pdp-guide">
              📚 Read the research first: <Link href={`/ingredients/${ingredient.slug}/`}>{ingredient.title || ingredient.name} guide</Link>
            </p>
          )}
        </div>
      </div>

      <div className="pdp-body">
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        <h2>Supplement Facts</h2>
        <p className="muted">
          {p.sample
            ? "The full Supplement Facts panel will be shown here once the final label is confirmed."
            : "See the product label for the full Supplement Facts panel, serving size and other ingredients."}
        </p>
        {topics.length > 0 && (
          <>
            <h2>Related health guides</h2>
            <ul className="chips">
              {topics.map((t) => (
                <li key={t.slug}>
                  <Link className="chip neutral" href={`/${t.slug}/`}>{t.name}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="disclaimer small muted">
          *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or
          prevent any disease. Keep out of reach of children.
        </p>
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2>You may also like</h2>
          <div className="shop-grid">
            {related.map((r) => (
              <ShopCard key={r.slug} product={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
