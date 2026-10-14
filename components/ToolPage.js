import Link from "next/link";
import Icon from "./Icon";
import JsonLd from "./JsonLd";
import { Breadcrumbs, Faq, Sources, breadcrumbSchema, faqSchema } from "./ArticleParts";
import { TOOLS } from "@/lib/tools";
import { absoluteUrl } from "@/lib/site";

export function toolMetadata(slug, title) {
  const t = TOOLS.find((x) => x.slug === slug);
  return { title: title || t.name, description: t.description, alternates: { canonical: t.href } };
}

export default function ToolPage({ slug, intro, children, faq, sources, after }) {
  const t = TOOLS.find((x) => x.slug === slug);
  const crumbs = [{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: t.name, href: t.href }];
  return (
    <div className="container page-head tool-wrap">
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebApplication", name: t.name, url: absoluteUrl(t.href), applicationCategory: "HealthApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
          breadcrumbSchema(crumbs, absoluteUrl),
          faqSchema(faq),
        ].filter(Boolean)}
      />
      <Breadcrumbs items={crumbs} />
      <h1>{t.name}</h1>
      <p className="sec-sub">{intro}</p>
      {children}
      {after && <div className="prose">{after}</div>}
      <Faq faq={faq} />
      <Sources sources={sources} />
      <p className="muted small">Free tool for education only. It doesn&apos;t replace advice from your doctor or pharmacist.</p>
      <section className="sec">
        <h2 className="sec-title">More free tools</h2>
        <div className="tool-grid">
          {TOOLS.filter((x) => x.slug !== slug).slice(0, 6).map((x) => (
            <Link key={x.slug} href={x.href} className="tool-card">
              <span className="cat-icon" aria-hidden="true" style={{ fontSize: 20 }}>{x.emoji}</span>
              <h3>{x.name}</h3>
              <span className="cta">Open <Icon name="arrow" size={16} /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
