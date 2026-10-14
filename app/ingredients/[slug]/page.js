import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
import ProductPicks from "@/components/ProductPicks";
import { AnswerBox, AuthorBox, Breadcrumbs, Byline, EvidenceGrade, Faq, Sources, Toc, breadcrumbSchema, faqSchema } from "@/components/ArticleParts";
import { getAllIngredients, getAllPosts, getIngredient, getToc, renderMarkdown } from "@/lib/content";
import { getAuthor } from "@/lib/authors";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { getTopic } from "@/lib/topics";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllIngredients().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const i = getIngredient(slug);
  if (!i) return {};
  return {
    title: i.seoTitle || i.title,
    description: i.description,
    alternates: { canonical: `/ingredients/${i.slug}` },
    openGraph: { type: "article", url: `/ingredients/${i.slug}`, title: i.seoTitle || i.title, description: i.description },
  };
}

export default async function IngredientPage({ params }) {
  const { slug } = await params;
  const ing = getIngredient(slug);
  if (!ing) notFound();
  const html = await renderMarkdown(ing.body);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Ingredients", href: "/ingredients" },
    { label: ing.name, href: `/ingredients/${ing.slug}` },
  ];
  const toc = [
    ...(ing.evidence?.length ? [{ id: "evidence", text: "Evidence at a glance" }] : []),
    ...getToc(ing.body),
    ...(ing.faq?.length ? [{ id: "faq", text: "FAQ" }] : []),
  ];
  // Guides that link to this ingredient page are its natural "read next".
  const related = getAllPosts().filter((p) => p.body.includes(`/ingredients/${ing.slug}`) || ing.body.includes(`(/${p.slug})`));
  const author = getAuthor(ing.author);

  return (
    <div className="container">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: ing.title,
            description: ing.description,
            datePublished: ing.date,
            dateModified: ing.updated || ing.date,
            about: { "@type": "DietarySupplement", name: ing.name },
            author: { "@type": "Organization", name: author.name },
            publisher: { "@type": "Organization", name: SITE_NAME },
            mainEntityOfPage: absoluteUrl(`/ingredients/${ing.slug}`),
          },
          breadcrumbSchema(crumbs, absoluteUrl),
          faqSchema(ing.faq),
        ].filter(Boolean)}
      />
      <div className="article-layout">
        <article>
          <Breadcrumbs items={crumbs} />
          <div className="badges">
            {ing.topics?.map((t) => getTopic(t)).filter(Boolean).map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className="badge-r">{t.name}</Link>
            ))}
          </div>
          <h1>{ing.title}</h1>
          <Byline doc={ing} />
          <AnswerBox text={ing.answer} label="Summary" />

          {ing.evidence?.length > 0 && (
            <section className="prose">
              <h2 id="evidence">Evidence at a glance</h2>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Use</th><th>Grade</th><th>What the research shows</th></tr></thead>
                  <tbody>
                    {ing.evidence.map((e) => (
                      <tr key={e.use}><td>{e.use}</td><td><EvidenceGrade grade={e.grade} /></td><td>{e.note}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="muted small">
                A: strong, consistent human evidence · B: moderate · C: limited or mixed · D: good evidence of no benefit.
              </p>
            </section>
          )}

          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          {ing.products?.length > 0 && (
            <section className="prose">
              <h2 id="where-to-buy">Where to buy</h2>
              <ProductPicks products={ing.products} />
            </section>
          )}
          <Faq faq={ing.faq} />
          <Sources sources={ing.sources} />
          <AuthorBox doc={ing} />
        </article>

        <aside>
          <div className="sticky-side">
            {ing.facts && (
              <div className="side-card">
                <h2>Quick facts</h2>
                <dl className="facts">
                  {Object.entries(ing.facts).map(([k, v]) => (
                    <div key={k} style={{ display: "contents" }}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>
            )}
            <div className="side-card"><h2>On this page</h2><Toc toc={toc} /></div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="sec">
          <h2>Related guides</h2>
          <div className="grid">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
        </section>
      )}
    </div>
  );
}
