import GuideHub from "@/components/GuideHub";

export const metadata = {
  title: "Supplement Dosing & Safety Guides",
  description: "How much to take, when to take it, safe upper limits, and which supplements shouldn't be combined, answered with official sources.",
  alternates: { canonical: "/dosing-safety" },
};

export default function DosingPage() {
  return (
    <GuideHub
      category="dosing"
      title="Dosing & safety guides"
      intro="Clear answers to the questions people ask most: daily amounts, timing, upper limits and safe combinations, each backed by official sources."
    />
  );
}
