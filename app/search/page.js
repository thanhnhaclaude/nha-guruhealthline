import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import { getSearchIndex } from "@/lib/content";
import { TOPICS } from "@/lib/topics";
import { TOOLS } from "@/lib/tools";

// Internal search result pages shouldn't be indexed.
export const metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }) {
  const { q = "" } = await searchParams;
  const terms = String(q).toLowerCase().split(/\s+/).filter(Boolean);
  const index = [
    ...getSearchIndex(),
    ...TOPICS.map((t) => ({ t: `Supplements for ${t.name}`, d: t.blurb, u: `/${t.slug}`, k: "Health goal" })),
    ...TOOLS.map((t) => ({ t: t.name, d: t.description, u: t.href, k: "Tool" })),
  ];
  const results = terms.length
    ? index
        .map((it) => {
          const hay = `${it.t} ${it.d}`.toLowerCase();
          const score = terms.reduce((s, w) => s + (it.t.toLowerCase().includes(w) ? 3 : hay.includes(w) ? 1 : -99), 0);
          return { ...it, score };
        })
        .filter((it) => it.score > 0)
        .sort((a, b) => b.score - a.score)
    : [];

  return (
    <div className="container page-head" style={{ maxWidth: "var(--prose)" }}>
      <h1>Search</h1>
      <SearchBox className="hero-search" defaultValue={q} />
      {terms.length > 0 && (
        <p className="muted">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>
      )}
      <div className="search-results">
        {results.map((r) => (
          <Link key={r.u} href={r.u}>
            <small>{r.k}</small>
            <strong style={{ display: "block" }}>{r.t}</strong>
            <span className="muted small">{r.d}</span>
          </Link>
        ))}
      </div>
      {terms.length > 0 && results.length === 0 && (
        <p>
          Nothing matched. Try a simpler term such as &quot;magnesium&quot; or &quot;sleep&quot;, or browse the{" "}
          <Link href="/ingredients">ingredient library</Link>.
        </p>
      )}
    </div>
  );
}
