import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
import { getAllPosts, getPostsByCategory } from "@/lib/content";
import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: { absolute: `${SITE_NAME}: Evidence-Based Supplement Guides & Comparisons` },
  description:
    "Clear, research-backed answers on supplement dosing, timing, safety and which form to buy. Every guide cites its sources.",
  alternates: { canonical: "/" },
};

const TRUST = [
  "Every guide cites peer-reviewed or official sources",
  "No paid rankings",
  "Updated when the evidence changes",
];

export default function Home() {
  const latest = getAllPosts().slice(0, 6);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL }} />
      <section className="hero">
        <div className="container">
          <span className="eyebrow">Evidence first, hype last</span>
          <h1>Supplement answers you can actually trust</h1>
          <p className="lead">
            How much to take, when to take it, which form works best and what to avoid, explained in plain
            English and backed by the research.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn btn-accent" href="/category/dosing">Browse dosing guides</Link>
            <Link className="btn btn-outline" href="/category/compare">See comparisons</Link>
          </div>
          <ul className="trust-row">
            {TRUST.map((t) => (
              <li key={t}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container">
        <section className="section">
          <div className="section-head">
            <h2>Latest guides</h2>
          </div>
          <div className="grid">
            {latest.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>

        {Object.entries(CATEGORIES).map(([slug, c]) => {
          const posts = getPostsByCategory(slug).slice(0, 3);
          if (!posts.length) return null;
          return (
            <section className="section" key={slug}>
              <div className="section-head">
                <h2>{c.name}</h2>
                <Link href={`/category/${slug}`}>All {c.name.toLowerCase()} guides</Link>
              </div>
              <p className="muted">{c.description}</p>
              <div className="grid">
                {posts.map((p) => <PostCard key={p.slug} post={p} />)}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
