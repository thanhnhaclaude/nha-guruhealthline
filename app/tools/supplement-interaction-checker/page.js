import ToolPage, { toolMetadata } from "@/components/ToolPage";
import InteractionChecker from "@/components/tools/InteractionChecker";
import { INTERACTION_SOURCES } from "@/lib/tooldata";

export const metadata = toolMetadata("interaction-checker", "Supplement Interaction Checker: Which Ones Not to Mix");

const FAQ = [
  { q: "Which supplements should not be taken together?", a: "Common examples are calcium with iron, high-dose zinc with iron or copper, and St. John's wort with 5-HTP. Many of these are about absorption, so taking them a few hours apart solves the problem." },
  { q: "Is this checker complete?", a: "No. It covers well-documented interactions only. Always ask a pharmacist to review everything you take, including prescription and over-the-counter drugs." },
];

export default function Page() {
  return (
    <ToolPage
      slug="interaction-checker"
      intro="Tick the supplements and medications you take. You'll see which pairs compete for absorption, need spacing, or shouldn't be combined."
      faq={FAQ}
      sources={INTERACTION_SOURCES}
    >
      <InteractionChecker />
    </ToolPage>
  );
}
