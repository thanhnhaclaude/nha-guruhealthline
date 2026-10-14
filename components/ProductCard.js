import Link from "next/link";
import { buildStoreUrl, storeLabel } from "@/lib/affiliate";
import { Stars } from "./ArticleParts";

export default function ProductCard({ review, rank }) {
  return (
    <article className="prod-card">
      {rank && <span className="rank">#{rank} {review.productType}</span>}
      {review.example && <span className="example-flag">Example layout</span>}
      <h3>{review.name}</h3>
      <Stars rating={review.rating} />
      <p className="prod-desc">{review.verdict}</p>
      {review.chips?.length > 0 && (
        <div className="chips">
          {review.chips.map((c) => <span className="chip neutral" key={c}>{c}</span>)}
        </div>
      )}
      <div className="prod-actions">
        <Link className="btn btn-outline" href={`/reviews/${review.slug}`}>Read full review</Link>
        {review.cta && (
          <a className="btn btn-accent" href={buildStoreUrl(review.cta)} target="_blank" rel="sponsored nofollow noopener">
            {review.cta.label} on {storeLabel(review.cta)}
          </a>
        )}
      </div>
    </article>
  );
}
