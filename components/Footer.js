import Link from "next/link";
import Logo from "./Logo";
import { SITE_NAME } from "@/lib/site";
import { TOPICS } from "@/lib/topics";
import { getAllIngredients, getAllPosts } from "@/lib/content";
import { TOOLS } from "@/lib/tools";

export default function Footer() {
  const ingredients = getAllIngredients();
  const compare = getAllPosts().filter((p) => p.category === "compare");
  const month = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return (
    <footer className="sf">
      <div className="fti">
        <div className="fttop">
          <div>
            <div className="ftlogo"><Logo /></div>
            <p className="ftdesc">
              Evidence-graded ingredient guides, honest comparisons and {TOOLS.length} free tools to help you make better
              supplement decisions. Updated {month}.
            </p>
            <p className="ftcopy">© {new Date().getFullYear()} {SITE_NAME} · All rights reserved</p>
          </div>
          <div>
            <div className="ftcolt">Health Goals</div>
            <ul className="ftlinks">
              {TOPICS.slice(0, 10).map((t) => <li key={t.slug}><Link href={`/${t.slug}`}>{t.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <div className="ftcolt">Ingredients &amp; Compare</div>
            <ul className="ftlinks">
              <li><Link href="/ingredients">All ingredients</Link></li>
              {ingredients.map((i) => <li key={i.slug}><Link href={`/ingredients/${i.slug}`}>{i.name}</Link></li>)}
              <li><Link href="/compare">All comparisons</Link></li>
              {compare.slice(0, 6).map((p) => <li key={p.slug}><Link href={`/${p.slug}`}>{p.vsA} vs {p.vsB}</Link></li>)}
            </ul>
          </div>
          <div>
            <div className="ftcolt">Tools &amp; Info</div>
            <ul className="ftlinks">
              <li><Link href="/tools">All free tools</Link></li>
              {TOOLS.slice(0, 8).map((t) => <li key={t.slug}><Link href={t.href}>{t.short}</Link></li>)}
              <li><Link href="/dosing-safety">Dosing &amp; safety</Link></li>
              <li><Link href="/supplement-safety-database">Safety database</Link></li>
              <li><Link href="/articles">Articles</Link></li>
              <li><Link href="/reviews">Reviews</Link></li>
              <li><Link href="/about">About us</Link></li>
            </ul>
          </div>
        </div>
        <div className="ftbot">
          <div className="ftlegal">
            <Link href="/editorial-policy">Editorial Policy</Link>
            <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
            <Link href="/medical-disclaimer">Medical Disclaimer</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/all-supplements">Sitemap</Link>
          </div>
          <p className="ftdisc">
            Content is for education only and isn&apos;t medical advice. Statements have not been evaluated by the FDA.
            Products discussed are not intended to diagnose, treat, cure or prevent any disease. As an Amazon Associate we
            earn from qualifying purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}
