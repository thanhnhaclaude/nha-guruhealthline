import ToolPage, { toolMetadata } from "@/components/ToolPage";
import CostPerDose from "@/components/tools/CostPerDose";

export const metadata = toolMetadata("cost-per-dose", "Supplement Cost-Per-Dose Calculator");

const FAQ = [
  { q: "Why compare cost per dose instead of price per bottle?", a: "Bottles differ in serving size and strength. A cheaper bottle can cost more per day if you need two or three capsules to reach the same dose." },
  { q: "Which number should I enter for minerals?", a: "Use the elemental amount, for example the magnesium or zinc content, not the weight of the whole compound such as magnesium glycinate." },
];

export default function Page() {
  return (
    <ToolPage
      slug="cost-per-dose"
      intro="Enter the price, servings and active amount of two products to see what your daily dose really costs."
      faq={FAQ}
    >
      <CostPerDose />
    </ToolPage>
  );
}
