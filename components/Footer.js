import Link from "next/link";
import Logo from "./Logo";
import { COMPANY, COMPANY_ADDRESS, SITE_NAME } from "@/lib/site";
import { TOPICS } from "@/lib/topics";
import { getAllPosts } from "@/lib/content";
import { TOOLS } from "@/lib/tools";

// Each link column holds the same number of links so the footer stays balanced.
const PER_COLUMN = 8;
const POPULAR_INGREDIENTS = [
  ["magnesium", "Magnesium"], ["vitamin-d3", "Vitamin D3"], ["omega-3", "Omega-3"], ["creatine", "Creatine"],
  ["ashwagandha", "Ashwagandha"], ["zinc", "Zinc"], ["probiotics", "Probiotics"], ["melatonin", "Melatonin"],
];

function Column({ title, all, links }) {
  return (
    <div>
      <div className="ftcolt">{title}</div>
      <ul className="ftlinks">
        {links.slice(0, PER_COLUMN).map(([href, label]) => (
          <li key={href}><Link href={href}>{label}</Link></li>
        ))}
        <li><Link href={all[0]} className="ftall">{all[1]} →</Link></li>
      </ul>
    </div>
  );
}

export default function Footer() {
  const compare = getAllPosts().filter((p) => p.category === "compare");
  const month = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return (
    <footer className="sf">
      <div className="fti">
        <div className="fttop">
          <div className="ftbrand">
            <div className="ftlogo"><Logo /></div>
            <p className="ftdesc">
              Evidence-graded ingredient guides, honest comparisons and {TOOLS.length} free tools to help you make better
              supplement decisions. Updated {month}.
            </p>
            <ul className="ftlinks ftabout">
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/editorial-policy">Editorial policy</Link></li>
              <li><Link href="/supplement-safety-database">Safety database</Link></li>
            </ul>
          </div>
          <Column
            title="Health Goals"
            all={["/all-supplements", "All health goals"]}
            links={TOPICS.filter((t) => t.grid).map((t) => [`/${t.slug}`, t.name])}
          />
          <Column
            title="Ingredients"
            all={["/ingredients", "All ingredients"]}
            links={POPULAR_INGREDIENTS.map(([slug, name]) => [`/ingredients/${slug}`, name])}
          />
          <Column
            title="Compare & Guides"
            all={["/compare", "All comparisons"]}
            links={[
              ...compare.slice(0, 5).map((p) => [`/${p.slug}`, `${p.vsA} vs ${p.vsB}`.replace(/\s*\(.*?\)/g, "")]),
              ["/dosing-safety", "Dosing & safety"],
              ["/articles", "Articles"],
              ["/reviews", "Reviews"],
            ]}
          />
          <Column
            title="Free Tools"
            all={["/tools", "All free tools"]}
            links={TOOLS.map((t) => [t.href, t.short])}
          />
        </div>
        <div className="ftbot">
          <div className="ftlegal">
            <Link href="/editorial-policy">Editorial Policy</Link>
            <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
            <Link href="/medical-disclaimer">Medical Disclaimer</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-sale">Terms of Sale</Link>
            <Link href="/shipping-policy">Shipping</Link>
            <Link href="/returns-refunds">Returns &amp; Refunds</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/all-supplements">Sitemap</Link>
          </div>
          <p className="ftcompany">
            {SITE_NAME} is owned and operated by <strong>{COMPANY.legalName}</strong> · {COMPANY_ADDRESS} · {COMPANY.email}
          </p>
          <p className="ftdisc">
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved. Content is for education only and isn&apos;t medical advice. Statements
            have not been evaluated by the FDA. Products discussed are not intended to diagnose, treat, cure or prevent any
            disease. As an Amazon Associate we earn from qualifying purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}
