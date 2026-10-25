import Link from "next/link";
import { formatUsd } from "@/lib/shop/config";
import Bottle from "./Bottle";

export default function ShopCard({ product }) {
  return (
    <Link href={`/shop/${product.slug}/`} className="shop-card">
      <Bottle product={product} size={180} />
      <span className="shop-goal">{product.goal}</span>
      <h3>{product.name}</h3>
      <p className="shop-meta">{[product.form, product.size].filter(Boolean).join(" · ")}</p>
      <p className="shop-price">
        {formatUsd(product.priceCents)}
        {product.compareAtCents > product.priceCents && <s>{formatUsd(product.compareAtCents)}</s>}
      </p>
      {product.sample && <span className="example-flag">Sample listing</span>}
    </Link>
  );
}
