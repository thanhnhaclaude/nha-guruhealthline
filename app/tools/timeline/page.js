import ToolPage, { toolMetadata } from "@/components/ToolPage";
import Timeline from "@/components/tools/Timeline";

export const metadata = toolMetadata("timeline", "How Long Do Supplements Take to Work? Onset Timeline");

export default function Page() {
  return (
    <ToolPage
      slug="timeline"
      intro={"See how long common supplements typically take to show an effect in clinical trials, from melatonin's minutes to calcium's months."}
      sources={[{ title: "NIH Office of Dietary Supplements: Fact sheets", url: "https://ods.od.nih.gov/factsheets/list-all/" }]}
    >
      <Timeline />
    </ToolPage>
  );
}
