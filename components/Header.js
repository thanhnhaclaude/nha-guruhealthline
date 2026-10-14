import Link from "next/link";
import { NAV, NAV_CTA, SITE_NAME } from "@/lib/site";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sh">
      <div className="shi">
        <Link href="/" className="logo" aria-label={`${SITE_NAME} home`}>
          <Logo />
        </Link>
        <nav className="snav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.emoji && <span aria-hidden="true">{n.emoji} </span>}
              {n.label}
            </Link>
          ))}
          <Link href={NAV_CTA.href} className="ncta">{NAV_CTA.label} →</Link>
        </nav>
        <div className="sh-actions">
          <Link href="/search" className="sh-icon" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.4-4.4" />
            </svg>
          </Link>
          <details className="mnav">
            <summary aria-label="Open menu">
              <span /><span /><span />
            </summary>
            <nav aria-label="Mobile">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href}>
                  {n.emoji && <span aria-hidden="true">{n.emoji} </span>}
                  {n.label}
                </Link>
              ))}
              <Link href={NAV_CTA.href} className="ncta">{NAV_CTA.label} →</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
