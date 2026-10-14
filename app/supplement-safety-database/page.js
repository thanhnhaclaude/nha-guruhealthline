import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Breadcrumbs, Sources, breadcrumbSchema } from "@/components/ArticleParts";
import { EVIDENCE } from "@/lib/evidence";
import { INTERACTIONS, INTERACTION_SOURCES } from "@/lib/tooldata";
import { absoluteUrl } from "@/lib/site";

export const metadata = {
  title: "Supplement Safety Database: Interactions & Warnings",
  description: "Documented supplement–drug and supplement–supplement interactions, plus safety warnings for popular supplements, in one searchable reference. No affiliate links.",
  alternates: { canonical: "/supplement-safety-database" },
};

const LABEL = { avoid: "Avoid combining", caution: "Use caution" };

export default function SafetyDatabase() {
  const rows = INTERACTIONS.filter((i) => i.level !== "ok").sort((a, b) => (a.level === b.level ? a.a.localeCompare(b.a) : a.level === "avoid" ? -1 : 1));
  const warnings = EVIDENCE.filter((e) => e.warning);
  const crumbs = [{ label: "Home", href: "/" }, { label: "Supplement safety database", href: "/supplement-safety-database" }];
  return (
    <div className="container page-head">
      <JsonLd data={[breadcrumbSchema(crumbs, absoluteUrl), { "@context": "https://schema.org", "@type": "Dataset", name: "Supplement safety database", description: metadata.description, url: absoluteUrl("/supplement-safety-database") }]} />
      <Breadcrumbs items={crumbs} />
      <h1>Supplement safety database</h1>
      <p className="sec-sub">
        {rows.length} documented interactions and {warnings.length} product-level warnings, compiled from NIH and NCCIH sources. This page has no affiliate
        links. To check your own combination, use the <Link href="/tools/supplement-interaction-checker/">interaction checker</Link> or the{" "}
        <Link href="/tools/supplement-drug-interactions/">drug interaction lookup</Link>.
      </p>

      <section className="sec">
        <h2 className="sec-title">Interactions</h2>
        <div className="table-wrap prose">
          <table>
            <thead><tr><th>Combination</th><th>Severity</th><th>What happens and what to do</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.a + r.b}>
                  <td><strong>{r.a}</strong> + <strong>{r.b}</strong></td>
                  <td><span className={`sev-tag ${r.level}`}>{LABEL[r.level]}</span></td>
                  <td>{r.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sec">
        <h2 className="sec-title">Supplement warnings</h2>
        <div className="table-wrap prose">
          <table>
            <thead><tr><th>Supplement</th><th>Warning</th></tr></thead>
            <tbody>
              {warnings.map((e) => (
                <tr key={e.id}><td><strong>{e.link ? <Link href={e.link}>{e.name}</Link> : e.name}</strong></td><td>{e.warning}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{ maxWidth: "var(--prose)" }}>
        <Sources sources={INTERACTION_SOURCES} />
        <p className="muted small">This list covers well-documented interactions only and isn&apos;t complete. Always tell your doctor and pharmacist about every supplement you take.</p>
      </div>
    </div>
  );
}
