import Link from "next/link";
import { CATEGORIES, SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">{SITE_NAME}</p>
          <p className="muted small">
            Educational content only, not medical advice. Talk to your doctor or pharmacist before starting a
            supplement, especially if you are pregnant, nursing, or take medication.
          </p>
        </div>
        <nav aria-label="Categories">
          <p className="footer-title">Guides</p>
          {Object.entries(CATEGORIES).map(([slug, c]) => (
            <Link key={slug} href={`/category/${slug}`}>
              {c.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Company">
          <p className="footer-title">About</p>
          <Link href="/about">About us</Link>
          <Link href="/editorial-policy">Editorial policy</Link>
          <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
          <Link href="/medical-disclaimer">Medical disclaimer</Link>
          <Link href="/privacy-policy">Privacy policy</Link>
        </nav>
      </div>
      <div className="container muted small footer-bottom">
        © {new Date().getFullYear()} {SITE_NAME}. As an Amazon Associate we earn from qualifying purchases.
      </div>
    </footer>
  );
}
