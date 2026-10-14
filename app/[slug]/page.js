import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import ProductPicks from "@/components/ProductPicks";
import PostCard, { formatDate } from "@/components/PostCard";
import { AnswerBox, AuthorBox, Breadcrumbs, Byline, Faq, Sources, Toc, breadcrumbSchema, faqSchema } from "@/components/ArticleParts";
import { getAllPages, getAllPosts, getPage, getPost, getToc, getTopicItems, renderMarkdown } from "@/lib/content";
import { getAuthor } from "@/lib/authors";
import { CATEGORIES, SITE_NAME, absoluteUrl } from "@/lib/site";
import { TOPICS, getTopic } from "@/lib/topics";

export const dynamicParams = false;

// One top-level namespace, like the original site: /<guide>, /<page>, /<health-goal>.
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
    return {
      title: `Best Supplements for ${topic.name}: Evidence-Based Guide`,
      description: `${topic.blurb} Ingredient guides, comparisons and reviews for ${topic.name.toLowerCase()}.`,
      alternates: { canonical: `/${slug}` },
      // An empty hub is a thin page: keep it out of search until it has content.
      ...(topicCount(slug) === 0 ? { robots: { index: false, follow: true } } : {}),
    };
  }
  const doc = getPost(slug) || getPage(slug);
  if (!doc) return {};
  const url = `/${doc.slug}`;
  return {
    title: doc.seoTitle || doc.title,
    description: doc.description,
    alternates: { canonical: url },
    ...(doc.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: doc.category ? "article" : "website",
      url,
      title: doc.seoTitle || doc.title,
      description: doc.description,
      ...(doc.category ? { publishedTime: doc.date, modifiedTime: doc.updated || doc.date } : {}),
    },
  };
}

export default async function DocPage({ params }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (topic) return <TopicHub topic={topic} />;
  const post = getPost(slug);
  if (post) return <Article post={post} />;
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

function TopicHub({ topic }) {
  const { guides, ingredients, reviews } = getTopicItems(topic.slug);
  const crumbs = [{ label: "Home", href: "/" }, { label: topic.name, href: `/${topic.slug}` }];
  const empty = !guides.length && !ingredients.length && !reviews.length;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs, absoluteUrl),
          { "@context": "https://schema.org", "@type": "CollectionPage", name: `Supplements for ${topic.name}`, url: absoluteUrl(`/${topic.slug}`) },
        ]}
      />
      <section className="review-hero">
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span className="cat-icon" style={{ width: 52, height: 52 }}><Icon name={topic.icon} size={28} /></span>
            <h1 style={{ margin: 0 }}>Supplements for {topic.name}</h1>
          </div>
          <p className="sec-sub" style={{ marginTop: 14 }}>{topic.blurb}</p>
        </div>
      </section>
      <div className="container">
        {reviews.length > 0 && (
          <section className="sec">
            <h2 className="sec-title">Top-rated products</h2>
            <div className="prod-grid">{reviews.map((r, i) => <ProductCard key={r.slug} review={r} rank={i + 1} />)}</div>
          </section>
        )}
        {ingredients.length > 0 && (
          <section className="sec">
            <h2 className="sec-title">Key ingredients</h2>
            <div className="dir-grid">
              {ingredients.map((i) => (
                <Link key={i.slug} href={`/ingredients/${i.slug}`} className="dir-item">
                  <span>{i.name}<small>{i.evidence?.find((e) => e.grade <= "B")?.use || i.facts?.Type}</small></span>
                  <Icon name="arrow" size={18} />
                </Link>
              ))}
            </div>
          </section>
        )}
        {guides.length > 0 && (
          <section className="sec">
            <h2 className="sec-title">Guides & comparisons</h2>
            <div className="grid">{guides.map((p) => <PostCard key={p.slug} post={p} />)}</div>
          </section>
        )}
        {empty && (
          <section className="sec">
            <p className="muted">
              Our {topic.name.toLowerCase()} guides are being researched. Meanwhile, try the{" "}
              <Link href="/quiz">supplement quiz</Link> or browse the <Link href="/ingredients">ingredient library</Link>.
            </p>
          </section>
        )}
        <section className="sec">
          <h2 className="sec-title">Other health goals</h2>
          <div className="cat-grid">
            {TOPICS.filter((t) => t.slug !== topic.slug).slice(0, 8).map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className="cat-card">
                <span className="cat-icon"><Icon name={t.icon} /></span>
                <span className="cat-name">{t.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

async function Article({ post }) {
  const html = await renderMarkdown(post.body);
  const toc = getToc(post.body);
  const author = getAuthor(post.author);
  const category = CATEGORIES[post.category];
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.related?.includes(post.slug)))
    .slice(0, 3);
  const url = absoluteUrl(`/${post.slug}`);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: category.name, href: category.href },
    { label: post.title, href: `/${post.slug}` },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: author.name, url: absoluteUrl(author.url) },
      publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
      ...(post.sources?.length ? { citation: post.sources.map((s) => s.url) } : {}),
    },
    breadcrumbSchema(crumbs, absoluteUrl),
    faqSchema(post.faq),
  ].filter(Boolean);

  return (
    <div className="container">
      <JsonLd data={schema} />
      <div className="article-layout">
        <article>
          <Breadcrumbs items={crumbs} />
          <h1>{post.title}</h1>
          <Byline doc={post} />
          {post.products?.length > 0 && (
            <p className="disclosure">
              We may earn a commission from links on this page, at no cost to you.{" "}
              <Link href="/affiliate-disclosure">How we make money</Link>.
            </p>
          )}
          <AnswerBox text={post.answer} />
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          {post.products?.length > 0 && (
            <section className="prose">
              <h2 id="where-to-buy">Where to buy</h2>
              <p>
                We don&apos;t accept payment for rankings. These links open a store search filtered to the form we
                discuss, so you can compare brands using the checklist above.
              </p>
              <ProductPicks products={post.products} />
            </section>
          )}
          <Faq faq={post.faq} />
          <Sources sources={post.sources} />
          <AuthorBox doc={post} />
        </article>
        <aside>
          <div className="sticky-side"><Toc toc={toc} /></div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2>Related guides</h2>
          <div className="grid">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
        </section>
      )}
    </div>
  );
}
