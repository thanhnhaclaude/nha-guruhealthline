import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/ArticleParts";
import { getAllReviews } from "@/lib/content";

export const metadata = {
  title: "Supplement Reviews: Independent, Evidence-Based Ratings",
  description: "Independent supplement reviews scored on ingredients, dose versus research, transparency, safety and value. See how we rate every product.",
  alternates: { canonical: "/reviews" },
};

const CRITERIA = [
  ["Ingredients", "Are the forms well absorbed and free of unnecessary fillers or proprietary blends?"],
  ["Effectiveness", "Do the doses match those used in human studies for the claimed benefit?"],
  ["Value", "What does the effective dose cost per day compared with alternatives?"],
  ["Transparency", "Are all doses disclosed, and is there independent third-party testing?"],
  ["Safety", "Are doses within upper limits, and are interactions and warnings clearly stated?"],
];

export default function ReviewsHub() {
  const reviews = getAllReviews();
  return (
    <div className="container page-head">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reviews" }]} />
      <h1>Supplement reviews</h1>
      <p className="sec-sub">
        Every product is scored out of 10 on five criteria, which combine into an overall rating out of 5. Brands can&apos;t pay
        for a review or a higher score.
      </p>

      <section className="sec">
        <h2 className="sec-title">How we score products</h2>
        <div className="table-wrap prose">
          <table>
            <thead><tr><th>Criterion</th><th>What we check</th></tr></thead>
            <tbody>{CRITERIA.map(([k, v]) => <tr key={k}><td><strong>{k}</strong></td><td>{v}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="sec">
        <h2 className="sec-title">All reviews</h2>
        {reviews.length ? (
          <div className="prod-grid">{reviews.map((r) => <ProductCard key={r.slug} review={r} />)}</div>
        ) : (
          <p className="muted">Our first product reviews are in progress. Meanwhile, browse the <Link href="/ingredients">ingredient guides</Link>.</p>
        )}
      </section>
    </div>
  );
}
