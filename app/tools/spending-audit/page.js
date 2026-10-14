import ToolPage, { toolMetadata } from "@/components/ToolPage";
import SpendingAudit from "@/components/tools/SpendingAudit";

export const metadata = toolMetadata("spending-audit", "Supplement Spending Audit: Find Waste in Your Stack");

export default function Page() {
  return (
    <ToolPage
      slug="spending-audit"
      intro={"List your supplements and monthly costs to see your yearly spend, ingredients you're doubling up on, and products with weak evidence."}
      sources={[{ title: "NIH Office of Dietary Supplements: Fact sheets", url: "https://ods.od.nih.gov/factsheets/list-all/" }]}
    >
      <SpendingAudit />
    </ToolPage>
  );
}
