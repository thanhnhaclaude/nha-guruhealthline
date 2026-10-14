import Link from "next/link";
import { CATEGORIES } from "@/lib/site";

export default function PostCard({ post }) {
  return (
    <Link href={`/${post.slug}`} className="card">
      <span className="tag">{CATEGORIES[post.category]?.name}</span>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <span className="meta">
        {post.readingMinutes} min read · Updated{" "}
        <time dateTime={post.updated || post.date}>{formatDate(post.updated || post.date)}</time>
      </span>
    </Link>
  );
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
