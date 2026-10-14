import GuideHub from "@/components/GuideHub";

export const metadata = {
  title: "Supplement Comparisons: X vs Y, Side by Side",
  description: "Head-to-head supplement comparisons: forms, doses, absorption, evidence and cost, so you can pick the right option for your goal.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <GuideHub
      category="compare"
      title="Supplement comparisons"
      intro="Two options, one decision. Each comparison lines up form, dose, absorption, evidence, side effects and cost, then tells you which fits which situation."
    />
  );
}
