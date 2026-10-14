import ToolPage, { toolMetadata } from "@/components/ToolPage";
import DrugInteractions from "@/components/tools/DrugInteractions";
import { INTERACTION_SOURCES } from "@/lib/tooldata";

export const metadata = toolMetadata("drug-interactions", "Supplement–Drug Interaction Checker: Look Up Your Medication");

const FAQ = [
  {
    "q": "Which supplements interact with blood thinners?",
    "a": "Vitamin K, St. John's wort, and high doses of fish oil, ginkgo, vitamin E, turmeric and garlic can affect warfarin or bleeding risk. Ask your prescriber before starting any of them."
  },
  {
    "q": "Can supplements make birth control fail?",
    "a": "St. John's wort can make hormonal contraceptives less effective. Tell your clinician about every supplement you take."
  }
];

export default function Page() {
  return (
    <ToolPage
      slug="drug-interactions"
      intro={"Choose a prescription medicine to see which supplements interact with it, ranked from \"avoid\" to \"good to know\"."}
      faq={FAQ}
      sources={INTERACTION_SOURCES}
    >
      <DrugInteractions />
    </ToolPage>
  );
}
