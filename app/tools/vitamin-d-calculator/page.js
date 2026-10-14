import ToolPage, { toolMetadata } from "@/components/ToolPage";
import VitaminDCalculator from "@/components/tools/VitaminDCalculator";

export const metadata = toolMetadata("vitamin-d-calculator", "Vitamin D Sunlight Calculator: Can Your Skin Make Vitamin D Today?");

const FAQ = [
  {
    "q": "What is a vitamin D winter?",
    "a": "The months when the sun is too low for UVB to reach the ground in useful amounts, so skin makes little or no vitamin D. In Boston that's roughly November to February."
  },
  {
    "q": "How much sun do I need for vitamin D?",
    "a": "It varies with latitude, season, time of day and skin tone. Because sun exposure also raises skin cancer risk, many people rely on food and supplements instead."
  }
];

export default function Page() {
  return (
    <ToolPage
      slug="vitamin-d-calculator"
      intro={"Enter your latitude, month and skin type. The calculator uses the sun's angle at midday to estimate whether UVB is strong enough for your skin to make vitamin D."}
      faq={FAQ}
      sources={[{ title: "Webb AR et al. Influence of season and latitude on the cutaneous synthesis of vitamin D3. J Clin Endocrinol Metab. 1988", url: "https://pubmed.ncbi.nlm.nih.gov/2839537/" }, { title: "NIH Office of Dietary Supplements: Vitamin D Fact Sheet for Health Professionals", url: "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/" }]}
    >
      <VitaminDCalculator />
    </ToolPage>
  );
}
