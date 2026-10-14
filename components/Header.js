import Link from "next/link";
import { NAV, NAV_CTA, SITE_NAME } from "@/lib/site";
import Icon from "./Icon";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          <Logo />
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.icon && <Icon name={n.icon} size={16} />}
              {n.label}
            </Link>
          ))}
          <Link href={NAV_CTA.href} className="nav-cta">
            {NAV_CTA.label}
            <Icon name="arrow" size={16} />
          </Link>
        </nav>
        <div className="header-actions">
          <Link href="/search" className="icon-btn" aria-label="Search">
            <Icon name="search" />
          </Link>
          <details className="mobile-nav">
            <summary aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <nav aria-label="Mobile">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href}>
                  {n.label}
                </Link>
              ))}
              <Link href={NAV_CTA.href} className="nav-cta">
                {NAV_CTA.label}
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
