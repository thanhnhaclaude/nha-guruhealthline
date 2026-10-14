import ToolPage, { toolMetadata } from "@/components/ToolPage";
import Quiz from "@/components/tools/Quiz";

export const metadata = toolMetadata("supplement-quiz", "Supplement Quiz: Which Supplements Do I Need?");

export default function Page() {
  return (
    <ToolPage
      slug="supplement-quiz"
      intro="Five quick questions about your goal, diet and life stage. You'll get a short, evidence-ranked list of supplements to research, not a shopping list."
    >
      <Quiz />
    </ToolPage>
  );
}
