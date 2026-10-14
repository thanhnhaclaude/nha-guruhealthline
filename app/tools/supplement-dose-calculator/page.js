import ToolPage, { toolMetadata } from "@/components/ToolPage";
import DoseCalculator from "@/components/tools/DoseCalculator";

export const metadata = toolMetadata("dose-calculator", "Supplement Dose Calculator: Daily Needs & Upper Limits");

const FAQ = [
  { q: "What's the difference between the RDA and the upper limit?", a: "The RDA is the daily amount that meets the needs of nearly all healthy people. The upper limit (UL) is the most you can take daily without a likely risk of harm. Aim near the RDA and stay below the UL." },
  { q: "Do these numbers include food?", a: "Yes. The targets cover food, drinks and supplements combined. For most nutrients the upper limit also covers all sources, but for magnesium it applies to supplements only." },
];

export default function Page() {
  return (
    <ToolPage
      slug="dose-calculator"
      intro={"Choose your sex and age to see the official daily target and safe upper limit for 13 common nutrients."}
      faq={FAQ}
      sources={[{ title: "NIH Office of Dietary Supplements: Nutrient Recommendations and Databases", url: "https://ods.od.nih.gov/HealthInformation/nutrientrecommendations.aspx" }]}
    >
      <DoseCalculator />
    </ToolPage>
  );
}
