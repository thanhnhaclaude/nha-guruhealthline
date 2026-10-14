import Link from "next/link";
import Icon from "@/components/Icon";
import { Breadcrumbs } from "@/components/ArticleParts";
import { TOOLS } from "@/lib/tools";

export const metadata = {
  title: "Free Supplement Tools & Calculators",
  description: "Free supplement tools: interaction checker, daily dose calculator, creatine calculator, cost-per-dose comparison and a personalized supplement quiz.",
  alternates: { canonical: "/tools" },
};

export default function ToolsHub() {
  return (
    <div className="container page-head">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />
      <h1>Free supplement tools</h1>
      <p className="sec-sub">Quick, private calculators that run in your browser. Nothing you enter is stored or sent anywhere.</p>
      <div className="tool-grid sec">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={t.href} className="tool-card">
            <span className="cat-icon"><Icon name={t.icon} /></span>
            <h3>{t.name}</h3>
            <p>{t.description}</p>
            <span className="cta">Open tool <Icon name="arrow" size={16} /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
