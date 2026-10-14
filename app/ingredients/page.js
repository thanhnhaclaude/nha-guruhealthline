import Link from "next/link";
import Icon from "@/components/Icon";
import { Breadcrumbs, EvidenceGrade } from "@/components/ArticleParts";
import { getAllIngredients } from "@/lib/content";

export const metadata = {
  title: "Supplement Ingredient Library: Evidence, Doses & Safety",
  description: "Evidence-graded guides to popular supplement ingredients: what each one does, the best-supported uses, safe doses, side effects and interactions.",
  alternates: { canonical: "/ingredients" },
};

export default function IngredientsHub() {
  const items = getAllIngredients();
  return (
    <div className="container page-head">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Ingredients" }]} />
      <h1>Ingredient library</h1>
      <p className="sec-sub">
        Each guide grades the evidence for every common use from A (strong) to D (evidence of no benefit), and lists doses,
        upper limits and interactions.
      </p>
      <div className="tool-grid sec">
        {items.map((i) => {
          const best = i.evidence?.[0];
          return (
            <Link key={i.slug} href={`/ingredients/${i.slug}`} className="tool-card">
              <span className="cat-icon"><Icon name="flask" /></span>
              <h3>{i.name}</h3>
              <p>{i.facts?.Type}</p>
              {best && (
                <p style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <EvidenceGrade grade={best.grade} /> {best.use}
                </p>
              )}
              <span className="cta">Read guide <Icon name="arrow" size={16} /></span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
