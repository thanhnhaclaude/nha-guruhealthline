import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ProductPicks from "@/components/ProductPicks";
import PostCard, { formatDate } from "@/components/PostCard";
import { getAllPages, getAllPosts, getPage, getPost, getToc, renderMarkdown } from "@/lib/content";
import { getAuthor } from "@/lib/authors";
import { CATEGORIES, SITE_NAME, absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...getAllPosts(), ...getAllPages()].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = getPost(slug) || getPage(slug);
  if (!doc) return {};
  const url = `/${doc.slug}`;
  return {
    // Unique, descriptive <title> and meta description per page (Google SEO Starter Guide).
    title: doc.seoTitle || doc.title,
    description: doc.description,
    alternates: { canonical: url },
    // Per-page noindex for pages that are published but not meant for search (Microsoft guidance).
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

async function Article({ post }) {
  const html = await renderMarkdown(post.body);
  const toc = getToc(post.body);
  const author = getAuthor(post.author);
  const category = CATEGORIES[post.category];
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.related?.includes(post.slug)))
    .slice(0, 3);
  const url = absoluteUrl(`/${post.slug}`);

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
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: category.name, item: absoluteUrl(`/category/${post.category}`) },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faq?.length) {
    schema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <div className="container">
      <JsonLd data={schema} />
      <div className="article-layout">
        <article>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href={`/category/${post.category}`}>{category.name}</Link></li>
              <li aria-current="page">{post.title}</li>
            </ol>
          </nav>
          <h1>{post.title}</h1>
          <div className="byline">
            <span>By <Link href={author.url}>{author.name}</Link></span>
            <span>Updated <time dateTime={post.updated || post.date}>{formatDate(post.updated || post.date)}</time></span>
            <span>{post.readingMinutes} min read</span>
            {post.sources?.length > 0 && <span>{post.sources.length} sources cited</span>}
          </div>
          {post.products?.length > 0 && (
            <p className="disclosure">
              We may earn a commission from links on this page, at no cost to you.{" "}
              <Link href="/affiliate-disclosure">How we make money</Link>.
            </p>
          )}
          {post.answer && (
            <div className="answer-box">
              <strong>Quick answer</strong>
              <p>{post.answer}</p>
            </div>
          )}
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

          {post.faq?.length > 0 && (
            <section className="prose faq">
              <h2 id="faq">Frequently asked questions</h2>
              {post.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <div><p>{f.a}</p></div>
                </details>
              ))}
            </section>
          )}

          {post.sources?.length > 0 && (
            <section className="prose sources">
              <h2 id="sources">Sources</h2>
              <ol>
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener">{s.title}</a>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <aside className="author-box" aria-label="About the author">
            <span className="avatar" aria-hidden="true">{author.initials}</span>
            <div>
              <strong>{author.name}</strong>
              <p className="muted small" style={{ margin: 0 }}>{author.bio}</p>
            </div>
          </aside>
          <p className="muted small" style={{ marginTop: 16 }}>
            This article is for education and is not a substitute for advice from your doctor. Read our{" "}
            <Link href="/medical-disclaimer">medical disclaimer</Link>.
          </p>
        </article>

        {toc.length > 2 && (
          <aside>
            <nav className="toc" aria-label="On this page">
              <p>On this page</p>
              <ol>
                {toc.map((h) => (
                  <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2>Related guides</h2>
          <div className="grid">
            {related.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
