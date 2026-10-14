import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
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

export function getAllPosts({ includeDrafts = false } = {}) {
  return readDir("posts")
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => String(b.updated || b.date).localeCompare(String(a.updated || a.date)));
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
