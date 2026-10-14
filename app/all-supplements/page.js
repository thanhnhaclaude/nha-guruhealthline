import Link from "next/link";
import Icon from "@/components/Icon";
import { Breadcrumbs } from "@/components/ArticleParts";
import { getAllIngredients, getAllPosts, getAllReviews } from "@/lib/content";
import { TOPICS } from "@/lib/topics";

export const metadata = {
  title: "All Supplements A–Z: Reviews, Ingredients & Guides",
  description: "Browse every supplement review, ingredient guide, comparison and health-goal page on one A–Z directory.",
  alternates: { canonical: "/all-supplements" },
};

function Group({ title, items }) {
  if (!items.length) return null;
  return (
    <section className="sec">
      <h2 className="sec-title">{title} <span className="muted small">({items.length})</span></h2>
      <div className="dir-grid">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="dir-item">
            <span>{it.label}{it.sub && <small>{it.sub}</small>}</span>
            <Icon name="arrow" size={18} />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Directory() {
  const az = (a, b) => a.label.localeCompare(b.label);
  return (
    <div className="container page-head">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All supplements" }]} />
      <h1>All supplements A–Z</h1>
      <p className="sec-sub">Every review, ingredient guide, comparison and health-goal page in one place.</p>
      <Group title="Product reviews" items={getAllReviews().map((r) => ({ href: `/reviews/${r.slug}`, label: r.name, sub: r.productType })).sort(az)} />
      <Group title="Ingredients" items={getAllIngredients().map((i) => ({ href: `/ingredients/${i.slug}`, label: i.name, sub: i.facts?.Type })).sort(az)} />
      <Group title="Guides & comparisons" items={getAllPosts().map((p) => ({ href: `/${p.slug}`, label: p.title.split(/[?:]/)[0] })).sort(az)} />
      <Group title="Health goals" items={TOPICS.map((t) => ({ href: `/${t.slug}`, label: t.name })).sort(az)} />
    </div>
  );
}
