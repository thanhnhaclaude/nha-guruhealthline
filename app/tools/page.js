import Link from "next/link";
import Icon from "@/components/Icon";
import { Breadcrumbs } from "@/components/ArticleParts";
import { TOOLS } from "@/lib/tools";

export const metadata = {
  title: "Free Supplement Tools & Calculators",
  description: "17 free supplement tools: interaction and drug checkers, dose and vitamin D calculators, label decoder, evidence database, snake oil detector and more.",
  alternates: { canonical: "/tools" },
};

export default function ToolsHub() {
  return (
    <div className="container page-head">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />
      <h1>Free supplement tools</h1>
      <p className="sec-sub">{TOOLS.length} quick, private calculators and checkers that run in your browser. Nothing you enter is stored or sent anywhere.</p>
      <div className="tool-grid sec">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={t.href} className="tool-card">
            <span className="cat-icon" aria-hidden="true" style={{ fontSize: 20 }}>{t.emoji}</span>
            <h3>{t.name}</h3>
            <p>{t.description}</p>
            <span className="cta">Open tool <Icon name="arrow" size={16} /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
