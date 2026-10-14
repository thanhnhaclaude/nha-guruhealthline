import Link from "next/link";
import { getAuthor } from "@/lib/authors";
import { formatDate } from "./PostCard";
import Icon from "./Icon";

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={it.label} aria-current={i === items.length - 1 ? "page" : undefined}>
            {it.href && i < items.length - 1 ? <Link href={it.href}>{it.label}</Link> : it.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function breadcrumbSchema(items, absoluteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: absoluteUrl(it.href) } : {}),
    })),
  };
}

export function faqSchema(faq) {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function Byline({ doc }) {
  const author = getAuthor(doc.author);
  return (
    <div className="byline">
      <span>By <Link href={author.url}>{author.name}</Link></span>
      <span>Updated <time dateTime={doc.updated || doc.date}>{formatDate(doc.updated || doc.date)}</time></span>
      {doc.readingMinutes && <span>{doc.readingMinutes} min read</span>}
      {doc.sources?.length > 0 && <span>{doc.sources.length} {doc.sources.length === 1 ? "source" : "sources"} cited</span>}
    </div>
  );
}

export function AnswerBox({ text, label = "Quick answer" }) {
  if (!text) return null;
  return (
    <div className="answer-box">
      <strong>{label}</strong>
      <p>{text}</p>
    </div>
  );
}

export function Faq({ faq }) {
  if (!faq?.length) return null;
  return (
    <section className="prose faq">
      <h2 id="faq">Frequently asked questions</h2>
      {faq.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <div><p>{f.a}</p></div>
        </details>
      ))}
    </section>
  );
}

export function Sources({ sources }) {
  if (!sources?.length) return null;
  return (
    <section className="prose sources">
      <h2 id="sources">Sources</h2>
      <ol>
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener">{s.title}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AuthorBox({ doc }) {
  const author = getAuthor(doc.author);
  return (
    <>
      <aside className="author-box" aria-label="About the author">
        <span className="avatar" aria-hidden="true">{author.initials}</span>
        <div>
          <strong>{author.name}</strong>
          <p className="muted small" style={{ margin: 0 }}>{author.bio}</p>
        </div>
      </aside>
      <p className="muted small" style={{ marginTop: 16 }}>
        This page is for education and is not a substitute for advice from your doctor. Read our{" "}
        <Link href="/medical-disclaimer">medical disclaimer</Link>.
      </p>
    </>
  );
}

export function Toc({ toc }) {
  if (!toc || toc.length < 3) return null;
  return (
    <nav className="toc" aria-label="On this page">
      <p>On this page</p>
      <ol>
        {toc.map((h) => (
          <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>
        ))}
      </ol>
    </nav>
  );
}

export function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`Rated ${rating} out of 5`}>
      <Icon name="star" size={16} />
      {Number(rating).toFixed(1)}/5
    </span>
  );
}

export function EvidenceGrade({ grade }) {
  const label = { A: "Strong evidence", B: "Moderate evidence", C: "Limited or mixed evidence", D: "Evidence suggests no benefit" }[grade];
  return (
    <span className={`evidence-grade grade-${grade}`} title={label} aria-label={label}>
      {grade}
    </span>
  );
}
