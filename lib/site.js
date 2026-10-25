// Central site configuration. Every value can be overridden with environment
// variables in Hostinger (hPanel → Node.js app → Environment variables).

export const SITE_NAME = process.env.SITE_NAME || "GuruHealthline";
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const SITE_TAGLINE = "Evidence-based supplement guides, written for real people.";

// Indexing lifecycle (Microsoft Dynamics 365 Commerce SEO guidance):
//   development → noindex,nofollow on every page
//   soft-launch → keep noindex while a limited audience tests the site
//   production  → indexable; robots.txt allows the whole site and links the sitemap
export const SITE_STAGE = process.env.SITE_STAGE || "development";
export const IS_PRODUCTION = SITE_STAGE === "production";

// Legal entity that owns and operates the site (shown in the footer, About,
// Contact and legal pages, and in Organization structured data).
export const COMPANY = {
  legalName: "SPARKX MARKETING CO., LIMITED",
  ubi: "605 014 114",
  type: "Foreign Profit Corporation",
  street: "411 108th Avenue Northeast, Suite 700",
  city: "Bellevue",
  region: "WA",
  postalCode: "98004",
  country: "United States",
  countryCode: "US",
  founded: "2022-12-30",
  email: "editor@guruhealthline.com",
};
export const COMPANY_ADDRESS = `${COMPANY.street}, ${COMPANY.city}, ${COMPANY.region} ${COMPANY.postalCode}, ${COMPANY.country}`;

export const AMAZON_TAG = process.env.AMAZON_TAG || "";
export const IHERB_RCODE = process.env.IHERB_RCODE || "";

// Guide types (frontmatter `category` in content/posts) and their hub URLs.
export const CATEGORIES = {
  dosing: {
    name: "Dosing & Safety",
    href: "/dosing-safety",
    description: "How much to take, when to take it, and which combinations are safe.",
  },
  compare: {
    name: "Comparisons",
    href: "/compare",
    description: "Side-by-side breakdowns of supplement forms and alternatives.",
  },
  articles: {
    name: "Articles",
    href: "/articles",
    description: "Practical guides to sleep, gut health, blood sugar, memory and more, with and without supplements.",
  },
};

// Main navigation: health goals first, then the content libraries.
export const NAV = [
  { href: "/weight-loss", label: "Weight Loss" },
  { href: "/brain-health", label: "Brain" },
  { href: "/blood-sugar", label: "Blood Sugar" },
  { href: "/mens-health", label: "Men's Health" },
  { href: "/gut-health", label: "Gut Health" },
  { href: "/joints", label: "Joints" },
  { href: "/ingredients", label: "Ingredients", emoji: "📚" },
  { href: "/compare", label: "Compare", emoji: "⚖️" },
  { href: "/tools", label: "Tools", emoji: "⚙️" },
  { href: "/reviews", label: "Reviews" },
  { href: "/shop", label: "Shop", emoji: "🛒" },
];
export const NAV_CTA = { href: "/all-supplements", label: "All supplements" };

// URLs end with "/" like the original site (next.config.mjs: trailingSlash: true).
export function absoluteUrl(path = "/") {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.endsWith("/") && !/\.[a-z0-9]+$/i.test(p)) p += "/";
  return `${SITE_URL}${p}`;
}
