import ToolPage, { toolMetadata } from "@/components/ToolPage";
import StackBuilder from "@/components/tools/StackBuilder";
import { INTERACTION_SOURCES } from "@/lib/tooldata";

export const metadata = toolMetadata("stack-builder", "Supplement Stack Builder: When to Take Each Supplement");

export default function Page() {
  return (
    <ToolPage
      slug="stack-builder"
      intro={"Pick the supplements you take and get a simple daily schedule, with competing minerals spread apart and interaction warnings."}
      sources={INTERACTION_SOURCES}
    >
      <StackBuilder />
    </ToolPage>
  );
}
