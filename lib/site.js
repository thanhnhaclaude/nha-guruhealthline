// Central site configuration. Every value can be overridden with environment
// variables in Hostinger (hPanel → Node.js app → Environment variables).

export const SITE_NAME = process.env.SITE_NAME || "NutriVerdict";
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const SITE_TAGLINE = "Evidence-based supplement guides, written for real people.";

// Indexing lifecycle (Microsoft Dynamics 365 Commerce SEO guidance):
//   development → noindex,nofollow on every page
//   soft-launch → keep noindex while a limited audience tests the site
//   production  → indexable; robots.txt allows the whole site and links the sitemap
export const SITE_STAGE = process.env.SITE_STAGE || "development";
export const IS_PRODUCTION = SITE_STAGE === "production";

export const AMAZON_TAG = process.env.AMAZON_TAG || "";
export const IHERB_RCODE = process.env.IHERB_RCODE || "";

export const CATEGORIES = {
  dosing: {
    name: "Dosing & Safety",
    description: "How much to take, when to take it, and which combinations are safe.",
  },
  compare: {
    name: "Comparisons",
    description: "Side-by-side breakdowns of supplement forms and alternatives.",
  },
  ingredients: {
    name: "Ingredient Guides",
    description: "What the research says about individual supplement ingredients.",
  },
};

export const NAV = [
  { href: "/category/dosing", label: "Dosing & Safety" },
  { href: "/category/compare", label: "Comparisons" },
  { href: "/category/ingredients", label: "Ingredients" },
  { href: "/about", label: "About" },
];

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
