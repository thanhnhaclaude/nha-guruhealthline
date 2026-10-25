import { getAllProductDocs } from "@/lib/content";
import { MAX_QTY, SHIPPING, dbEnabled } from "./config";
import { query } from "./db";

const toCents = (usd) => Math.round(Number(usd || 0) * 100);

function fromDoc(doc) {
  return {
    slug: doc.slug,
    name: doc.name,
    shortName: doc.shortName || doc.name,
    description: doc.description,
    form: doc.form,
    size: doc.size || "",
    servings: doc.servings || "",
    color: doc.color || "#1a7a4a",
    ingredient: doc.ingredient,
    topics: doc.topics || [],
    goal: doc.goal || "",
    sample: Boolean(doc.sample),
    body: doc.body,
    updated: doc.updated,
    priceCents: toCents(doc.price),
    compareAtCents: doc.compareAt ? toCents(doc.compareAt) : null,
    active: doc.active !== false,
    shopifyVariantId: doc.shopifyVariantId || "",
  };
}

async function loadSettings() {
  if (!dbEnabled()) return new Map();
  try {
    const rows = await query("SELECT * FROM product_settings");
    return new Map(rows.map((r) => [r.slug, r]));
  } catch (e) {
    // The catalog still renders from Markdown if the database is unreachable.
    console.error("[shop] product settings unavailable:", e.message);
    return new Map();
  }
}

function applySettings(p, s) {
  if (!s) return p;
  return {
    ...p,
    priceCents: s.price_cents ?? p.priceCents,
    compareAtCents: s.compare_at_cents ?? p.compareAtCents,
    active: s.active == null ? p.active : Boolean(s.active),
    shopifyVariantId: s.shopify_variant_id || p.shopifyVariantId,
  };
}

/** Every product (active or not) with admin overrides applied. */
export async function getProducts({ includeInactive = false } = {}) {
  const settings = await loadSettings();
  return getAllProductDocs()
    .map((d) => applySettings(fromDoc(d), settings.get(d.slug)))
    .filter((p) => includeInactive || p.active);
}

export async function getProduct(slug) {
  return (await getProducts({ includeInactive: true })).find((p) => p.slug === slug) || null;
}

/** Products that build time can list without a database (static params, sitemap). */
export function getProductSlugs() {
  return getAllProductDocs().map((d) => ({ slug: d.slug, sample: Boolean(d.sample), updated: d.updated }));
}

export function shippingFor(subtotalCents) {
  return subtotalCents >= SHIPPING.freeFromCents ? 0 : SHIPPING.flatCents;
}

/**
 * Prices a cart on the server. The browser only sends slugs and quantities;
 * names and prices always come from the catalog, never from the client.
 */
export async function priceCart(rawItems, { allowSamples }) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) throw new CartError("Your cart is empty.");
  const catalog = new Map((await getProducts()).map((p) => [p.slug, p]));
  const merged = new Map();
  for (const it of rawItems.slice(0, 50)) {
    const qty = Math.floor(Number(it?.qty));
    if (typeof it?.slug !== "string" || !Number.isFinite(qty) || qty < 1) continue;
    merged.set(it.slug, Math.min(MAX_QTY, (merged.get(it.slug) || 0) + qty));
  }
  const items = [];
  for (const [slug, qty] of merged) {
    const p = catalog.get(slug);
    if (!p) throw new CartError("An item in your cart is no longer available. Please refresh your cart.");
    if (p.sample && !allowSamples) throw new CartError(`${p.name} is not available for sale yet.`);
    items.push({ slug, name: p.name, qty, unitCents: p.priceCents, lineCents: p.priceCents * qty, shopifyVariantId: p.shopifyVariantId });
  }
  if (items.length === 0) throw new CartError("Your cart is empty.");
  const subtotalCents = items.reduce((s, i) => s + i.lineCents, 0);
  const shippingCents = shippingFor(subtotalCents);
  return { items, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}

export class CartError extends Error {}
