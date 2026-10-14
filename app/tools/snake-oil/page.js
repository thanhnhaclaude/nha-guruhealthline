import ToolPage, { toolMetadata } from "@/components/ToolPage";
import SnakeOil from "@/components/tools/SnakeOil";

export const metadata = toolMetadata("snake-oil", "Supplement Snake Oil Detector: Spot Misleading Health Claims");

const FAQ = [
  {
    "q": "Can supplements claim to cure diseases?",
    "a": "No. In the US, dietary supplements can't legally claim to diagnose, treat, cure or prevent disease. A product making such claims is a red flag."
  }
];

export default function Page() {
  return (
    <ToolPage
      slug="snake-oil"
      intro={"Paste marketing copy from any supplement and get an instant red-flag score based on warning signs regulators look for."}
      faq={FAQ}
      sources={[{ title: "FDA: Health Fraud Scams", url: "https://www.fda.gov/consumers/health-fraud-scams" }]}
    >
      <SnakeOil />
    </ToolPage>
  );
}
