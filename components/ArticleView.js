import Link from "next/link";
import JsonLd from "./JsonLd";
import ProductPicks from "./ProductPicks";
import PostCard from "./PostCard";
import { AnswerBox, AuthorBox, Breadcrumbs, Byline, Faq, Sources, Toc, breadcrumbSchema, faqSchema } from "./ArticleParts";
import { getAllArticles, getAllPosts, getToc, renderMarkdown } from "@/lib/content";
import { getAuthor } from "@/lib/authors";
import { CATEGORIES, SITE_NAME, absoluteUrl } from "@/lib/site";

// Shared article layout for /<slug>/ guides and /articles/<slug>/ articles.
export default async function ArticleView({ post, basePath = "" }) {
  const html = await renderMarkdown(post.body);
  const toc = getToc(post.body);
  const author = getAuthor(post.author);
  const category = CATEGORIES[post.category] || CATEGORIES.articles;
  const path = `${basePath}/${post.slug}`;
  const pool = [...getAllPosts(), ...getAllArticles().map((a) => ({ ...a, category: "articles", href: `/articles/${a.slug}` }))];
  const related = pool
    .filter((p) => p.slug !== post.slug && (post.related?.includes(p.slug) || p.related?.includes(post.slug) || p.topics?.some((t) => post.topics?.includes(t))))
    .slice(0, 3);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: category.name, href: category.href },
    { label: post.title, href: path },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      mainEntityOfPage: absoluteUrl(path),
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

export function articleMetadata(doc, path) {
  return {
    title: doc.seoTitle || doc.title,
    description: doc.description,
    alternates: { canonical: path },
    ...(doc.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "article",
      url: path,
      title: doc.seoTitle || doc.title,
      description: doc.description,
      publishedTime: doc.date,
      modifiedTime: doc.updated || doc.date,
    },
  };
}
