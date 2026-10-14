import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getPostsByCategory } from "@/lib/content";
import { CATEGORIES } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const c = CATEGORIES[category];
  if (!c) return {};
  return {
    title: `${c.name} Guides`,
    description: c.description,
    alternates: { canonical: `/category/${category}` },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const c = CATEGORIES[category];
  if (!c) notFound();
  const posts = getPostsByCategory(category);
  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li aria-current="page">{c.name}</li>
        </ol>
      </nav>
      <h1>{c.name} Guides</h1>
      <p className="lead muted">{c.description}</p>
      <div className="grid section">
        {posts.length ? posts.map((p) => <PostCard key={p.slug} post={p} />) : <p>New guides are on the way.</p>}
      </div>
    </div>
  );
}
