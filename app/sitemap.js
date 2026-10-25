import { getAllArticles, getAllIngredients, getAllPages, getAllPosts, getAllReviews, getTopicGuide, getTopicItems } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { TOPICS } from "@/lib/topics";
import { TOOLS } from "@/lib/tools";
import { getProductSlugs } from "@/lib/shop/products";

export default function sitemap() {
  const posts = getAllPosts().filter((p) => !p.noindex);
  const latest = posts[0]?.updated || posts[0]?.date;
  const entry = (path, lastModified, priority) => ({ url: absoluteUrl(path), lastModified, priority });

  return [
    entry("/", latest, 1),
    ...["/ingredients", "/compare", "/dosing-safety", "/tools", "/reviews", "/all-supplements", "/articles", "/supplement-safety-database"].map((p) => entry(p, latest, 0.8)),
    ...TOPICS.filter((t) => {
      const it = getTopicItems(t.slug);
      return getTopicGuide(t.slug) || it.guides.length + it.ingredients.length + it.reviews.length > 0; // empty hubs are noindex
    }).map((t) => entry(`/${t.slug}`, latest, 0.7)),
    ...posts.map((p) => entry(`/${p.slug}`, p.updated || p.date, 0.8)),
    ...getAllIngredients().map((i) => entry(`/ingredients/${i.slug}`, i.updated || i.date, 0.8)),
    ...getAllArticles().map((a) => entry(`/articles/${a.slug}`, a.updated || a.date, 0.7)),
    ...getAllReviews({ includeExamples: false }).filter((r) => !r.noindex).map((r) => entry(`/reviews/${r.slug}`, r.updated || r.date, 0.8)),
    entry("/shop", latest, 0.8),
    ...getProductSlugs().filter((p) => !p.sample).map((p) => entry(`/shop/${p.slug}`, p.updated || latest, 0.7)),
    ...TOOLS.map((t) => entry(t.href, latest, 0.6)),
    ...getAllPages().filter((p) => !p.noindex).map((p) => entry(`/${p.slug}`, p.updated, 0.3)),
  ];
}
