import ToolPage, { toolMetadata } from "@/components/ToolPage";
import ExpiryCalc from "@/components/tools/ExpiryCalc";

export const metadata = toolMetadata("expiry-calc", "Supplement Expiry & Storage Checker");

const FAQ = [
  {
    "q": "Are expired supplements safe?",
    "a": "Most aren't dangerous, but they may have lost potency. Probiotics and oils degrade fastest; replace them once expired."
  }
];

export default function Page() {
  return (
    <ToolPage
      slug="expiry-calc"
      intro={"Check how long until your supplement's date, and whether the way you store it could be shortening its life."}
      faq={FAQ}
      sources={[]}
    >
      <ExpiryCalc />
    </ToolPage>
  );
}
