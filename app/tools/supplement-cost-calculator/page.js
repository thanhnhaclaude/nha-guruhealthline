import ToolPage, { toolMetadata } from "@/components/ToolPage";
import CostCalculator from "@/components/tools/CostCalculator";

export const metadata = toolMetadata("cost-calculator", "Supplement Cost-Per-Day Calculator");

export default function Page() {
  return (
    <ToolPage
      slug="cost-calculator"
      intro={"Enter the price, container size and serving to see what a supplement really costs per day, month and year, and compare two products."}
      sources={[]}
    >
      <CostCalculator />
    </ToolPage>
  );
}
