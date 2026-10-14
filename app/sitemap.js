import { getAllPages, getAllPosts } from "@/lib/content";
import { CATEGORIES, absoluteUrl } from "@/lib/site";

export default function sitemap() {
  const posts = getAllPosts().filter((p) => !p.noindex);
  const latest = posts[0]?.updated || posts[0]?.date;

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    ...Object.keys(CATEGORIES).map((c) => ({
      url: absoluteUrl(`/category/${c}`),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/${p.slug}`),
      lastModified: p.updated || p.date,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...getAllPages()
      .filter((p) => !p.noindex)
      .map((p) => ({ url: absoluteUrl(`/${p.slug}`), lastModified: p.updated, priority: 0.3 })),
  ];
}
