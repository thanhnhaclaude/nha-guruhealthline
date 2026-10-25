import { DM_Sans, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { CartProvider } from "@/components/shop/CartContext";
import { COMPANY, IS_PRODUCTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const heading = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"], style: ["normal", "italic"], variable: "--font-heading", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-body", display: "swap" });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: Evidence-Based Supplement Guides`, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
  // development / soft-launch → noindex,nofollow on every page.
  robots: IS_PRODUCTION ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#1a7a4a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            legalName: COMPANY.legalName,
            url: SITE_URL,
            logo: `${SITE_URL}/icon-512.png`,
            email: COMPANY.email,
            foundingDate: COMPANY.founded,
            identifier: { "@type": "PropertyValue", propertyID: "Washington UBI", value: COMPANY.ubi.replace(/\s/g, "") },
            address: {
              "@type": "PostalAddress",
              streetAddress: COMPANY.street,
              addressLocality: COMPANY.city,
              addressRegion: COMPANY.region,
              postalCode: COMPANY.postalCode,
              addressCountry: COMPANY.countryCode,
            },
          }}
        />
        <CartProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
