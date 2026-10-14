import ToolPage, { toolMetadata } from "@/components/ToolPage";
import DeficiencyCheck from "@/components/tools/DeficiencyCheck";

export const metadata = toolMetadata("deficiency-quiz", "Nutrient Deficiency Risk Check: Which Tests to Ask For");

export default function Page() {
  return (
    <ToolPage
      slug="deficiency-quiz"
      intro={"Tick your diet, life stage and medication risk factors to see which nutrients are worth asking your doctor to test."}
      sources={[{ title: "NIH Office of Dietary Supplements: Fact sheets", url: "https://ods.od.nih.gov/factsheets/list-all/" }]}
    >
      <DeficiencyCheck />
    </ToolPage>
  );
}
