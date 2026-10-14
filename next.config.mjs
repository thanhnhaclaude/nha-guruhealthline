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
      // The original site had near-duplicate URLs competing for one keyword
      // (keyword cannibalization). Keep the URLs but consolidate into one page.
      { source: "/magnesium-vs-melatonin-for-sleep", destination: "/melatonin-vs-magnesium-for-sleep/", permanent: true },
      { source: "/zinc-vs-zinc-picolinate", destination: "/zinc-picolinate-vs-gluconate/", permanent: true },
      { source: "/vitamin-d3-vs-k2", destination: "/can-you-take-vitamin-d-and-k2-together/", permanent: true },
      // Original-site URLs that duplicated another page's topic → consolidated (one strong page per keyword).
      ...[
        ["/eye-health-supplements", "/vision/"],
        ["/eye-supplements-vision", "/vision/"],
        ["/immune-system-supplements", "/immune-system/"],
        ["/lung-health-supplements", "/lung-health/"],
        ["/memory-brain", "/brain-health/"],
        ["/skin-care", "/skin-health-supplements/"],
        ["/sleep-supplement", "/sleep/"],
        ["/supplements-for-sleep-problems-insomnia", "/sleep/"],
        ["/supplements-for-gut-health", "/gut-health/"],
        ["/supplements-for-joint-pain-arthritis", "/joints/"],
        ["/diabetes", "/blood-sugar/"],
        ["/supplements-for-type-2-diabetes", "/blood-sugar/"],
        ["/best-supplements-for-womens-weight-loss", "/womens-weight-loss/"],
        ["/weight-loss-supplements-for-women-over-50", "/womens-weight-loss/"],
        ["/metabolism", "/weight-loss/"],
        ["/nails", "/hair/"],
        ["/tinnitus", "/hearing/"],
        ["/perimenopause-supplements", "/menopause-supplements/"],
        ["/anti-aging", "/longevity-supplements/"],
        ["/how-long-does-berberine-take-to-work", "/berberine-dosage-timing/"],
        ["/how-long-does-it-take-berberine-to-kick-in", "/berberine-dosage-timing/"],
        ["/articles/how-long-does-berberine-take-to-work", "/berberine-dosage-timing/"],
        ["/articles/berberine-with-metformin", "/berberine-vs-metformin/"],
        ["/articles/best-probiotic-after-antibiotics", "/can-you-take-probiotics-with-antibiotics/"],
        ["/articles/magnesium-glycinate-vs-malate", "/magnesium-glycinate-vs-malate/"],
        ["/articles/magnesium-glycinate-vs-oxide", "/magnesium-glycinate-vs-oxide/"],
        ["/articles/vitamin-d3-without-k2", "/can-you-take-vitamin-d-and-k2-together/"],
        ["/articles/best-supplements-for-joint-pain", "/joints/"],
        ["/articles/best-supplements-for-men-over-40", "/supplements-for-men-over-40/"],
        ["/articles/best-supplements-for-dental-health", "/dental-health/"],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
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
