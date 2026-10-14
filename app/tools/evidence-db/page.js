import ToolPage, { toolMetadata } from "@/components/ToolPage";
import EvidenceDb from "@/components/tools/EvidenceDb";

export const metadata = toolMetadata("evidence-db", "Supplement Evidence Database: What Works, Graded A to D");

export default function Page() {
  return (
    <ToolPage
      slug="evidence-db"
      intro={"Search and filter popular supplements. Each claimed use is graded from A (strong evidence) to D (no good evidence), with typical onset times and safety warnings."}
      sources={[{ title: "NIH Office of Dietary Supplements: Fact sheets", url: "https://ods.od.nih.gov/factsheets/list-all/" }]}
    >
      <EvidenceDb />
    </ToolPage>
  );
}
