import ToolPage, { toolMetadata } from "@/components/ToolPage";
import DiabetesRisk from "@/components/tools/DiabetesRisk";

export const metadata = toolMetadata("blood-sugar-risk-score", "Type 2 Diabetes Risk Score Calculator");

export default function Page() {
  return (
    <ToolPage
      slug="blood-sugar-risk-score"
      intro={"Seven questions adapted from the American Diabetes Association risk test. A score of 5 or more suggests you should ask your doctor about testing."}
      sources={[{ title: "American Diabetes Association: 60-Second Type 2 Diabetes Risk Test", url: "https://diabetes.org/diabetes-risk-test" }]}
    >
      <DiabetesRisk />
    </ToolPage>
  );
}
