import { notFound } from "next/navigation";
import ArticleView, { articleMetadata } from "@/components/ArticleView";
import { getAllArticles, getArticle } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  return a ? articleMetadata(a, `/articles/${a.slug}`) : {};
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  return <ArticleView post={{ ...a, category: "articles" }} basePath="/articles" />;
}
