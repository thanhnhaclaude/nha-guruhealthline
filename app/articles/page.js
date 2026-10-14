import PostCard from "@/components/PostCard";
import { Breadcrumbs } from "@/components/ArticleParts";
import { getAllArticles } from "@/lib/content";

export const metadata = {
  title: "Health & Supplement Articles",
  description: "Practical, evidence-based articles on sleep, gut health, blood sugar, memory, eyesight and belly fat, with and without supplements.",
  alternates: { canonical: "/articles" },
};

export default function ArticlesHub() {
  const articles = getAllArticles().map((a) => ({ ...a, category: "articles", href: `/articles/${a.slug}` }));
  return (
    <div className="container page-head">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Articles" }]} />
      <h1>Articles</h1>
      <p className="sec-sub">Practical guides that start with what works best, which is often not a supplement, and then cover the options with real evidence.</p>
      <div className="grid sec">{articles.map((a) => <PostCard key={a.slug} post={a} />)}</div>
    </div>
  );
}
