const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const SITE_STAGE = process.env.SITE_STAGE || "development";
const primaryHost = new URL(SITE_URL).host;
const NOINDEX = { key: "X-Robots-Tag", value: "noindex, nofollow" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Same URL style as the original site: /how-much-magnesium-per-day/
  trailingSlash: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Moved or merged URLs: permanent (301/308) redirects consolidate ranking signals.
  async redirects() {
    return [
      { source: "/category/dosing", destination: "/dosing-safety", permanent: true },
      { source: "/category/compare", destination: "/compare", permanent: true },
      { source: "/category/ingredients", destination: "/ingredients", permanent: true },
      { source: "/zinc-benefits-dosage-side-effects", destination: "/ingredients/zinc", permanent: true },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ];
    // Before production (development / soft-launch): noindex on every response.
    if (SITE_STAGE !== "production") {
      return [{ source: "/:path*", headers: [...securityHeaders, NOINDEX] }];
    }
    return [
      { source: "/:path*", headers: securityHeaders },
      // Temporary or internal domains (e.g. *.hostingersite.com) must never be
      // indexed — only the primary domain in SITE_URL is.
      {
        source: "/:path*",
        missing: [{ type: "host", value: primaryHost.replace(/\./g, "\\.") }],
        headers: [NOINDEX],
      },
    ];
  },
};

export default nextConfig;
