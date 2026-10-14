import ToolPage, { toolMetadata } from "@/components/ToolPage";
import LabelDecoder from "@/components/tools/LabelDecoder";

export const metadata = toolMetadata("label-decoder", "Supplement Label Decoder: Check Doses and Evidence");

export default function Page() {
  return (
    <ToolPage
      slug="label-decoder"
      intro={"Paste the Supplement Facts panel from any product. You'll see the evidence grade for each ingredient, doses above adult upper limits, and proprietary blend warnings."}
      sources={[{ title: "NIH Office of Dietary Supplements: Fact sheets", url: "https://ods.od.nih.gov/factsheets/list-all/" }]}
    >
      <LabelDecoder />
    </ToolPage>
  );
}
