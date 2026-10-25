import { IS_PRODUCTION, absoluteUrl } from "@/lib/site";

export default function robots() {
  // Production: allow the whole site and point crawlers at the sitemap.
  // Earlier stages rely on the noindex meta tag + X-Robots-Tag header instead of
  // Disallow, because a disallowed page can't be crawled to see its noindex.
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/cart/", "/checkout/"] }],
    sitemap: IS_PRODUCTION ? absoluteUrl("/sitemap.xml") : undefined,
  };
}
