import Link from "next/link";
import { getAllProductDocs } from "@/lib/content";

/**
 * Links from content pages to matching shop products (by ingredient or health
 * goal). Static pages read the Markdown catalog, so prices are left out here;
 * sample listings are never shown.
 */
export default function ShopLinks({ ingredient, topic, title = "From our shop" }) {
  const products = getAllProductDocs().filter(
    (p) => !p.sample && p.active !== false && ((ingredient && p.ingredient === ingredient) || (topic && p.topics?.includes(topic))),
  );
  if (products.length === 0) return null;
  return (
    <section className="shop-links">
      <h2>{title}</h2>
      <ul>
        {products.slice(0, 4).map((p) => (
          <li key={p.slug}>
            <Link href={`/shop/${p.slug}/`}>
              <strong>{p.name}</strong>
              <span>{p.form} · Free US shipping over $50 →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
