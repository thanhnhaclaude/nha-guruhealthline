import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import PostCard, { formatDate } from "@/components/PostCard";
import ArticleView, { articleMetadata } from "@/components/ArticleView";
import { AnswerBox, Breadcrumbs, EvidenceGrade, Faq, Sources, breadcrumbSchema, faqSchema } from "@/components/ArticleParts";
import { getAllPages, getAllPosts, getPage, getPost, getTopicGuide, getTopicItems, renderMarkdown } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { TOPICS, getTopic } from "@/lib/topics";

export const dynamicParams = false;

// One top-level namespace, like the original site: /<guide>/, /<page>/, /<health-goal>/.
export function generateStaticParams() {
  return [...getAllPosts(), ...getAllPages(), ...TOPICS].map((p) => ({ slug: p.slug }));
}

const topicCount = (slug) => {
  const it = getTopicItems(slug);
  return it.guides.length + it.ingredients.length + it.reviews.length;
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (topic) {
    const guide = getTopicGuide(slug);
    return {
      title: guide?.seoTitle || `Best Supplements for ${topic.name}: Evidence-Based Guide`,
      description: guide?.description || `${topic.blurb} Ingredient guides, comparisons and reviews for ${topic.name.toLowerCase()}.`,
      alternates: { canonical: `/${slug}` },
      // A hub with neither a guide nor linked content is thin: keep it out of search.
      ...(!guide && topicCount(slug) === 0 ? { robots: { index: false, follow: true } } : {}),
    };
  }
  const post = getPost(slug);
  if (post) return articleMetadata(post, `/${post.slug}`);
  const page = getPage(slug);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${page.slug}` } };
}

export default async function DocPage({ params }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (topic) return <TopicHub topic={topic} />;
  const post = getPost(slug);
  if (post) return <ArticleView post={post} />;
  const page = getPage(slug);
  if (!page) notFound();
  const html = await renderMarkdown(page.body);
  return (
    <div className="container" style={{ maxWidth: "var(--prose)", paddingTop: 40 }}>
      <h1>{page.title}</h1>
      {page.updated && <p className="muted small">Last updated {formatDate(page.updated)}</p>}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

async function TopicHub({ topic }) {
  const guide = getTopicGuide(topic.slug);
  const html = guide ? await renderMarkdown(guide.body) : "";
  const { guides, ingredients, reviews } = getTopicItems(topic.slug);
  const crumbs = [{ label: "Home", href: "/" }, { label: topic.name, href: `/${topic.slug}` }];
  const empty = !guide && !guides.length && !ingredients.length && !reviews.length;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs, absoluteUrl),
          {
            "@context": "https://schema.org",
            "@type": guide ? "Article" : "CollectionPage",
            ...(guide ? { headline: guide.title, datePublished: guide.date, dateModified: guide.updated || guide.date } : { name: `Supplements for ${topic.name}` }),
            url: absoluteUrl(`/${topic.slug}`),
          },
          guide && faqSchema(guide.faq),
        ].filter(Boolean)}
      />
      <section className="review-hero">
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span className="cat-icon" style={{ width: 52, height: 52, fontSize: 28 }} aria-hidden="true">{topic.emoji || <Icon name={topic.icon} size={28} />}</span>
            <h1 style={{ margin: 0 }}>{guide?.title || `Supplements for ${topic.name}`}</h1>
          </div>
          <p className="sec-sub" style={{ marginTop: 14 }}>{guide?.description || topic.blurb}</p>
          {guide && (
            <p className="muted small" style={{ marginTop: 8 }}>
              By the editorial team · Updated {formatDate(guide.updated || guide.date)} · {guide.sources?.length || 0} sources cited
            </p>
          )}
        </div>
      </section>
      <div className="container">
        {guide && (
          <section className="sec" style={{ paddingBottom: 0, maxWidth: "var(--prose)" }}>
            <AnswerBox text={guide.answer} label="The short answer" />
            {guide.picks?.length > 0 && (
              <div className="prose">
                <h2 id="evidence-ranked">Evidence-ranked options</h2>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Supplement</th><th>Evidence</th><th>Typical dose</th><th>Notes</th></tr></thead>
                    <tbody>
                      {guide.picks.map((p) => (
                        <tr key={p.name}>
                          <td>{p.link ? <Link href={p.link}><strong>{p.name}</strong></Link> : <strong>{p.name}</strong>}</td>
                          <td><EvidenceGrade grade={p.grade} /></td>
                          <td>{p.dose}</td>
                          <td>{p.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="muted small">A: strong · B: moderate · C: limited or mixed · D: good evidence of no benefit. See the <Link href="/tools/evidence-db/">evidence database</Link>.</p>
              </div>
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          </section>
        )}
        {reviews.length > 0 && (
          <section className="sec">
            <h2 className="sec-title">Top-rated products</h2>
            <div className="prod-grid">{reviews.map((r, i) => <ProductCard key={r.slug} review={r} rank={i + 1} />)}</div>
          </section>
        )}
        {ingredients.length > 0 && (
          <section className="sec">
            <h2 className="sec-title">Ingredient guides</h2>
            <div className="dir-grid">
              {ingredients.map((i) => (
                <Link key={i.slug} href={`/ingredients/${i.slug}`} className="dir-item">
                  <span>{i.name}<small>{i.group}</small></span>
                  <Icon name="arrow" size={18} />
                </Link>
              ))}
            </div>
          </section>
        )}
        {guides.length > 0 && (
          <section className="sec">
            <h2 className="sec-title">Related guides & comparisons</h2>
            <div className="grid">{guides.map((p) => <PostCard key={p.slug} post={p} />)}</div>
          </section>
        )}
        {guide && (
          <div style={{ maxWidth: "var(--prose)" }}>
            <Faq faq={guide.faq} />
            <Sources sources={guide.sources} />
            <p className="muted small">Educational content, not medical advice. Read our <Link href="/medical-disclaimer/">medical disclaimer</Link>.</p>
          </div>
        )}
        {empty && (
          <section className="sec">
            <p className="muted">
              Our {topic.name.toLowerCase()} guide is being researched. Meanwhile, try the <Link href="/quiz">supplement quiz</Link> or
              browse the <Link href="/ingredients">ingredient library</Link>.
            </p>
          </section>
        )}
        <section className="sec">
          <h2 className="sec-title">Other health goals</h2>
          <div className="cgrid">
            {TOPICS.filter((t) => t.slug !== topic.slug && t.grid).slice(0, 8).map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className="cc">
                <span className="ci" aria-hidden="true">{t.emoji}</span>
                <span className="cn">{t.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
