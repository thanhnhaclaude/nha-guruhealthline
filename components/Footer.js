import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { TOPICS } from "@/lib/topics";
import { getAllIngredients } from "@/lib/content";
import { TOOLS } from "@/lib/tools";

export default function Footer() {
  const ingredients = getAllIngredients().slice(0, 6);
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">{SITE_NAME}</p>
          <p className="footer-desc">
            Evidence-based supplement guides, ingredient research and free tools. Educational content only, not
            medical advice. Talk to your doctor or pharmacist before starting a supplement.
          </p>
        </div>
        <nav aria-label="Health goals">
          <p className="footer-title">Health goals</p>
          {TOPICS.slice(0, 10).map((t) => (
            <Link key={t.slug} href={`/${t.slug}`}>{t.name}</Link>
          ))}
        </nav>
        <nav aria-label="Research">
          <p className="footer-title">Ingredients & guides</p>
          <Link href="/ingredients">All ingredients</Link>
          {ingredients.map((i) => (
            <Link key={i.slug} href={`/ingredients/${i.slug}`}>{i.name}</Link>
          ))}
          <Link href="/compare">All comparisons</Link>
          <Link href="/dosing-safety">Dosing & safety</Link>
        </nav>
        <nav aria-label="Tools">
          <p className="footer-title">Free tools</p>
          <Link href="/tools">All tools</Link>
          {TOOLS.map((t) => (
            <Link key={t.slug} href={t.href}>{t.short}</Link>
          ))}
        </nav>
        <nav aria-label="Company">
          <p className="footer-title">About</p>
          <Link href="/about">About us</Link>
          <Link href="/editorial-policy">Editorial policy</Link>
          <Link href="/reviews">How we review</Link>
          <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
          <Link href="/medical-disclaimer">Medical disclaimer</Link>
          <Link href="/privacy-policy">Privacy policy</Link>
        </nav>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} {SITE_NAME}. As an Amazon Associate we earn from qualifying purchases. Statements
        on this site have not been evaluated by the FDA. Products discussed are not intended to diagnose, treat, cure or
        prevent any disease.
      </div>
    </footer>
  );
}
