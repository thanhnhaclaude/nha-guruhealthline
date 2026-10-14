import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { AuthorBox, Breadcrumbs, Byline, Faq, Sources, Stars, Toc, breadcrumbSchema, faqSchema } from "@/components/ArticleParts";
import { getAllReviews, getReview, getToc, renderMarkdown } from "@/lib/content";
import { buildStoreUrl, storeLabel } from "@/lib/affiliate";
import { getAuthor } from "@/lib/authors";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { getTopic } from "@/lib/topics";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllReviews().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = getReview(slug);
  if (!r) return {};
  return {
    title: r.seoTitle || `${r.name} Review: Ingredients, Pros & Cons`,
    description: r.description,
    alternates: { canonical: `/reviews/${r.slug}` },
    ...(r.example || r.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ReviewPage({ params }) {
  const { slug } = await params;
  const r = getReview(slug);
  if (!r) notFound();
  const html = await renderMarkdown(r.body);
  const toc = [
    { id: "verdict", text: "Our verdict" },
    ...(r.ingredients?.length ? [{ id: "ingredients", text: "Ingredients & doses" }] : []),
    { id: "pros-cons", text: "Pros & cons" },
    ...getToc(r.body),
    ...(r.faq?.length ? [{ id: "faq", text: "FAQ" }] : []),
  ];
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Reviews", href: "/reviews" },
    { label: r.name, href: `/reviews/${r.slug}` },
  ];
  const ctaUrl = r.cta ? buildStoreUrl(r.cta) : null;
  const author = getAuthor(r.author);

  const schema = [
    breadcrumbSchema(crumbs, absoluteUrl),
    faqSchema(r.faq),
    // Review markup only for real, published reviews, never for layout samples.
    !r.example && {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: { "@type": "Product", name: r.name, brand: r.brand ? { "@type": "Brand", name: r.brand } : undefined },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      author: { "@type": "Organization", name: author.name },
      publisher: { "@type": "Organization", name: SITE_NAME },
      datePublished: r.date,
      reviewBody: r.verdict,
    },
  ].filter(Boolean);

  return (
    <div className={ctaUrl ? "has-sticky" : undefined}>
      <JsonLd data={schema} />
      <section className="review-hero">
        <div className="container">
          <Breadcrumbs items={crumbs} />
          {r.example && (
            <p className="example-banner">
              <strong>Example layout.</strong> This is a sample review that shows the page design. It isn&apos;t a real product
              and is hidden automatically when the site goes to production.
            </p>
          )}
          <div className="badges">
            <span className="badge-r gold"><Stars rating={r.rating} /></span>
            {r.topics?.map((t) => getTopic(t)).filter(Boolean).map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className="badge-r">{t.name}</Link>
            ))}
          </div>
          <h1>{r.name} Review</h1>
          <Byline doc={r} />
          <div className="verdict-box" id="verdict">
            <div className="score-big" aria-label={`Overall rating ${r.rating} out of 5`}>
              <div style={{ textAlign: "center" }}><b>{Number(r.rating).toFixed(1)}</b><span style={{ display: "block" }}>out of 5</span></div>
            </div>
            <div>
              <strong>Our verdict</strong>
              <p>{r.verdict}</p>
            </div>
            {ctaUrl && (
              <a className="btn btn-accent" href={ctaUrl} target="_blank" rel="sponsored nofollow noopener">
                {r.cta.label} on {storeLabel(r.cta)}
              </a>
            )}
          </div>
          {ctaUrl && (
            <p className="muted small" style={{ marginTop: 10 }}>
              We may earn a commission if you buy through this link. <Link href="/affiliate-disclosure">Learn more</Link>.
            </p>
          )}
        </div>
      </section>

      <div className="container review-layout">
        <article>
          {r.ingredients?.length > 0 && (
            <section className="prose">
              <h2 id="ingredients">Ingredients & doses</h2>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Ingredient</th><th>Dose per serving</th><th>What the research says</th></tr></thead>
                  <tbody>
                    {r.ingredients.map((i) => (
                      <tr key={i.name}><td>{i.name}</td><td>{i.dose}</td><td>{i.evidence}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="prose">
            <h2 id="pros-cons">Pros & cons</h2>
            <div className="pros-cons">
              <div className="pros">
                <h3><Icon name="check" size={18} /> Pros</h3>
                <ul>{r.pros?.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
              <div className="cons">
                <h3><Icon name="x" size={18} /> Cons</h3>
                <ul>{r.cons?.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </div>
            <div className="pros-cons">
              <div className="pros">
                <h3>Good fit if you</h3>
                <ul>{r.goodFor?.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
              <div className="cons">
                <h3>Consider alternatives if you</h3>
                <ul>{r.skipIf?.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </div>
          </section>

          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          <Faq faq={r.faq} />
          <Sources sources={r.sources} />
          <AuthorBox doc={r} />
        </article>

        <aside>
          <div className="sticky-side">
            {r.scores && (
              <div className="side-card">
                <h2>Editorial scores</h2>
                {Object.entries(r.scores).map(([k, v]) => (
                  <div className="score-row" key={k}>
                    <span>{k}</span>
                    <span className="meter" aria-hidden="true"><i style={{ width: `${v * 10}%` }} /></span>
                    <b>{Number(v).toFixed(1)}</b>
                  </div>
                ))}
                <p className="muted small" style={{ margin: "10px 0 0" }}>
                  Overall <Stars rating={r.rating} />
                </p>
              </div>
            )}
            {r.facts && (
              <div className="side-card">
                <h2>Quick facts</h2>
                <dl className="facts">
                  {Object.entries(r.facts).map(([k, v]) => (
                    <div key={k} style={{ display: "contents" }}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>
            )}
            <div className="side-card">
              <h2>On this page</h2>
              <Toc toc={toc} />
            </div>
          </div>
        </aside>
      </div>

      {ctaUrl && (
        <div className="sticky-cta">
          <div className="container">
            <span className="name">{r.name} <Stars rating={r.rating} /></span>
            <a className="btn btn-accent" href={ctaUrl} target="_blank" rel="sponsored nofollow noopener">{r.cta.label}</a>
          </div>
        </div>
      )}
    </div>
  );
}
