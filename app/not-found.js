import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: 64, maxWidth: "var(--prose)" }}>
      <h1>We couldn&apos;t find that page</h1>
      <p className="muted">The guide may have moved. Try one of these instead:</p>
      <p style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="btn btn-accent" href="/">Go to the homepage</Link>
        <Link className="btn btn-outline" href="/category/dosing">Dosing guides</Link>
      </p>
    </div>
  );
}
