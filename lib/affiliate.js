import { AMAZON_TAG, IHERB_RCODE } from "./site";

// Builds the outbound URL for a product defined in a post's frontmatter.
// Products link to a store search, not a fabricated "winner": the reader picks
// a brand using the buying criteria in the article.
export function buildStoreUrl(product) {
  const q = encodeURIComponent(product.query || product.name);
  if (product.store === "iherb") {
    const base = `https://www.iherb.com/search?kw=${q}`;
    return IHERB_RCODE ? `${base}&rcode=${encodeURIComponent(IHERB_RCODE)}` : base;
  }
  const base = `https://www.amazon.com/s?k=${q}`;
  return AMAZON_TAG ? `${base}&tag=${encodeURIComponent(AMAZON_TAG)}` : base;
}

export function storeLabel(product) {
  return product.store === "iherb" ? "iHerb" : "Amazon";
}
