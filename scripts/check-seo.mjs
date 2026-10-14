// SEO lint for content/posts and content/ingredients, based on Google's SEO Starter Guide:
// unique & descriptive titles, page-specific meta descriptions, descriptive URLs,
// descriptive link text, image alt text, and no keyword stuffing.
// Run: npm run check:seo
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const C = path.join(process.cwd(), "content");
const list = (d) => (fs.existsSync(path.join(C, d)) ? fs.readdirSync(path.join(C, d)).filter((f) => f.endsWith(".md")) : []);
const strip = (f) => f.replace(/\.md$/, "");
const { TOPICS } = await import("../lib/topics.js");
const { TOOLS } = await import("../lib/tools.js");

// Linted content: guides at /<slug> and ingredient pages at /ingredients/<slug>.
const files = [
  ...list("posts").map((f) => ({ file: path.join(C, "posts", f), slug: strip(f) })),
  ...list("ingredients").map((f) => ({ file: path.join(C, "ingredients", f), slug: `ingredients/${strip(f)}` })),
  ...list("topics").map((f) => ({ file: path.join(C, "topics", f), slug: strip(f) })),
  ...list("articles").map((f) => ({ file: path.join(C, "articles", f), slug: `articles/${strip(f)}` })),
];
const knownSlugs = new Set([
  ...files.map((f) => f.slug),
  ...list("pages").map(strip),
  ...list("reviews").map((f) => `reviews/${strip(f)}`),
  ...TOPICS.map((t) => t.slug),
  ...TOOLS.map((t) => t.href.slice(1)),
  "ingredients", "compare", "dosing-safety", "tools", "reviews", "all-supplements", "quiz", "search", "articles", "supplement-safety-database",
]);

const seen = { title: new Map(), desc: new Map() };
let errors = 0;
let warnings = 0;

for (const { file, slug } of files) {
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const issues = [];
  const err = (m) => { issues.push(`  ✖ ${m}`); errors++; };
  const warn = (m) => { issues.push(`  ⚠ ${m}`); warnings++; };

  const title = data.seoTitle || data.title || "";
  const kw = (data.primaryKeyword || "").toLowerCase();
  const desc = data.description || "";
  // Everything that renders as page text: answer box, body, picks table and FAQ.
  const extra = [
    ...(data.picks || []).map((p) => `${p.name} ${p.dose} ${p.note}`),
    ...(data.faq || []).map((f) => `${f.q} ${f.a}`),
  ].join(" ");
  const text = `${data.answer || ""} ${content} ${extra}`.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);

  if (!title) err("missing title");
  if (title.length > 60) warn(`<title> is ${title.length} chars (aim ≤ 60 so it isn't cut off)`);
  if (!desc) err("missing meta description");
  else if (desc.length < 70 || desc.length > 160) warn(`description is ${desc.length} chars (aim 70–160)`);
  if (!kw) err("missing primaryKeyword");
  else {
    const kwWords = kw.split(" ");
    const loose = (s) => kwWords.every((w) => s.toLowerCase().includes(w));
    if (!loose(title)) warn(`primary keyword words not all in <title>`);
    if (!loose(data.title || "")) warn(`primary keyword words not all in H1`);
    if (!loose(words.slice(0, 120).join(" "))) warn("primary keyword not in the first ~100 words");
    // Keyword stuffing check: the exact phrase repeated unnaturally often
    // (3+ times and more than once per 100 words of visible text).
    const hits = text.split(kw).length - 1;
    const per100 = (hits * 100) / words.length;
    if (hits >= 3 && per100 > 1) err(`exact keyword phrase used ${hits}× (${per100.toFixed(1)} per 100 words) looks like stuffing`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug.split("/").pop())) err(`URL slug "${slug}" should be lowercase words joined by hyphens`);
  if (!data.sources?.length) warn("no sources cited (important for health/YMYL topics)");
  if (!data.date || !data.updated) warn("missing date or updated");

  for (const [, alt] of content.matchAll(/!\[([^\]]*)\]\([^)]+\)/g)) {
    if (!alt.trim()) err("image without alt text");
  }
  for (const [, label, href] of content.matchAll(/\[([^\]]+)\]\((\/[^)#]*)\)/g)) {
    if (/^(click here|here|read more|this)$/i.test(label.trim())) warn(`vague link text "${label}"`);
    if (!knownSlugs.has(href.replace(/^\//, "").replace(/\/$/, ""))) err(`broken internal link ${href}`);
  }
  for (const r of data.related || []) if (!knownSlugs.has(r)) err(`related slug "${r}" not found`);
  const internal = [...content.matchAll(/\]\(\/[^)]+\)/g)].length;
  if (internal === 0) warn("no internal links in the body");

  for (const [k, v] of [["title", title], ["desc", desc]]) {
    if (seen[k].has(v)) err(`duplicate ${k} with ${seen[k].get(v)}`);
    seen[k].set(v, slug);
  }

  console.log(`${issues.length ? "•" : "✔"} /${slug}  (${words.length} words, kw: "${kw}")`);
  issues.forEach((i) => console.log(i));
}

console.log(`\n${files.length} posts · ${errors} errors · ${warnings} warnings`);
process.exit(errors ? 1 : 0);
