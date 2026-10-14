import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { IS_PRODUCTION } from "./site";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

const ROOT = path.join(process.cwd(), "content");

function readDir(kind) {
  const dir = path.join(ROOT, kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = data.slug || file.replace(/\.md$/, "");
      // YAML turns 2026-10-14 into a Date; keep plain ISO date strings instead.
      for (const k of ["date", "updated"]) {
        if (data[k] instanceof Date) data[k] = data[k].toISOString().slice(0, 10);
      }
      const words = content.split(/\s+/).filter(Boolean).length;
      return { ...data, slug, body: content, words, readingMinutes: Math.max(1, Math.round(words / 230)) };
    });
}

const byUpdated = (a, b) => String(b.updated || b.date).localeCompare(String(a.updated || a.date));

export function getAllPosts({ includeDrafts = false } = {}) {
  return readDir("posts")
    .filter((p) => includeDrafts || !p.draft)
    .sort(byUpdated);
}

export function getAllIngredients() {
  return readDir("ingredients").sort((a, b) => a.name.localeCompare(b.name));
}

export function getIngredient(slug) {
  return getAllIngredients().find((i) => i.slug === slug) || null;
}

// Reviews marked `example: true` are layout samples: shown with a banner and
// noindex before launch, and removed entirely once SITE_STAGE=production.
export function getAllReviews({ includeExamples = !IS_PRODUCTION } = {}) {
  return readDir("reviews")
    .filter((r) => includeExamples || !r.example)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

export function getReview(slug) {
  return getAllReviews().find((r) => r.slug === slug) || null;
}

// Editorial guide text for a health-topic page (content/topics/<slug>.md).
export function getAllTopicGuides() {
  return readDir("topics");
}

export function getTopicGuide(slug) {
  return getAllTopicGuides().find((t) => t.slug === slug) || null;
}

// Long-form articles served at /articles/<slug>/.
export function getAllArticles() {
  return readDir("articles").sort(byUpdated);
}

export function getArticle(slug) {
  return getAllArticles().find((a) => a.slug === slug) || null;
}

// Everything tagged with a health topic, for the topic hub pages.
export function getTopicItems(topic) {
  const has = (x) => x.topics?.includes(topic);
  return {
    guides: [...getAllPosts(), ...getAllArticles().map((a) => ({ ...a, category: "articles", href: `/articles/${a.slug}` }))].filter(has),
    ingredients: getAllIngredients().filter(has),
    reviews: getAllReviews().filter(has),
  };
}

// Small index for the client-side search box.
export function getSearchIndex() {
  return [
    ...getAllPosts().map((p) => ({ t: p.title, d: p.description, u: `/${p.slug}`, k: p.category === "compare" ? "Comparison" : "Guide" })),
    ...getAllIngredients().map((i) => ({ t: i.name, d: i.description, u: `/ingredients/${i.slug}`, k: "Ingredient" })),
    ...getAllReviews().map((r) => ({ t: `${r.name} review`, d: r.description, u: `/reviews/${r.slug}`, k: "Review" })),
    ...getAllArticles().map((a) => ({ t: a.title, d: a.description, u: `/articles/${a.slug}`, k: "Article" })),
    ...getAllTopicGuides().map((g) => ({ t: g.title, d: g.description, u: `/${g.slug}`, k: "Guide" })),
  ];
}

export function getPost(slug) {
  return getAllPosts().find((p) => p.slug === slug) || null;
}

export function getPostsByCategory(category) {
  return getAllPosts().filter((p) => p.category === category);
}

export function getAllPages() {
  return readDir("pages");
}

export function getPage(slug) {
  return getAllPages().find((p) => p.slug === slug) || null;
}

export async function renderMarkdown(md) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify)
    .process(md);
  // Wrap tables so they scroll horizontally on phones instead of the page.
  return String(file)
    // Internal links get the trailing slash so they don't hop through a redirect.
    .replace(/href="(\/[^"#?.]*?[^/"#?])(#[^"]*)?"/g, 'href="$1/$2"')
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

// Table of contents built from the H2 headings, matching rehype-slug's ids.
export function getToc(md) {
  const slugger = new GithubSlugger();
  return md
    .split("\n")
    .filter((l) => /^#{2,3}\s/.test(l))
    .map((l) => {
      const level = l.match(/^#+/)[0].length;
      const text = l.replace(/^#+\s+/, "").trim();
      return { id: slugger.slug(text), text, level };
    })
    .filter((h) => h.level === 2);
}
