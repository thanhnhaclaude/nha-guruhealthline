import PostCard from "./PostCard";
import { Breadcrumbs } from "./ArticleParts";
import { getAllPosts } from "@/lib/content";
import { CATEGORIES } from "@/lib/site";

export default function GuideHub({ category, title, intro }) {
  const c = CATEGORIES[category];
  const posts = getAllPosts().filter((p) => p.category === category);
  return (
    <div className="container page-head">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: c.name }]} />
      <h1>{title}</h1>
      <p className="sec-sub">{intro}</p>
      <div className="grid sec">{posts.map((p) => <PostCard key={p.slug} post={p} />)}</div>
    </div>
  );
}
