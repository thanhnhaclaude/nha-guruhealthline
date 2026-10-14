import Link from "next/link";
import ToolPage, { toolMetadata } from "@/components/ToolPage";
import CreatineCalculator from "@/components/tools/CreatineCalculator";

export const metadata = toolMetadata("creatine-calculator", "Creatine Calculator: Dose by Body Weight");

export default function Page() {
  return (
    <ToolPage
      slug="creatine-calculator"
      intro={"Enter your body weight to get a daily creatine monohydrate dose and an optional loading plan, based on the International Society of Sports Nutrition position stand."}
      sources={[{ title: "Kreider RB et al. ISSN position stand: safety and efficacy of creatine supplementation. J Int Soc Sports Nutr. 2017", url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z" }]}
      after={<p>Want the reasoning behind these numbers? Read <Link href="/how-much-creatine-per-day">how much creatine per day</Link>.</p>}
    >
      <CreatineCalculator />
    </ToolPage>
  );
}
