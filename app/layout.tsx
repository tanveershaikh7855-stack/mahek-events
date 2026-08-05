import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { seo, business } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

const siteUrl = getSiteUrl();

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Variable font: a single woff2 (200–800) replaces five per-weight files, so
// FCP doesn't wait on a handful of font downloads. All weights (400–800) are
// covered natively — identical rendering to the old five-weight setup.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  // Points to wherever the site is actually reachable (NEXT_PUBLIC_SITE_URL),
  // so canonical/OG URLs resolve; falls back to the brand domain in dev.
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: {
    default: seo.metaTitle,
    template: `%s | ${business.name}`,
  },
  description: seo.metaDescription,
  // seo.keywords is a `readonly` tuple (content.ts uses `as const`); Metadata
  // wants a mutable string[].
  keywords: [...seo.keywords],
  authors: [{ name: business.name }],
  creator: business.name,
  publisher: business.name,
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: business.name,
    title: seo.metaTitle,
    description: seo.metaDescription,
    images: [
      {
        url: seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${business.name} - Premium Balloons & Decorations`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.metaTitle,
    description: seo.metaDescription,
    images: [seo.ogImage],
  },
  // Real Search Console token supplied via env; omitted otherwise so a
  // placeholder meta tag never ships.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Tab/bookmark icons come from app/favicon.ico (current logo, 16/32/48)
            plus app/icon.png and app/apple-icon.png via Next's file
            conventions; the manifest (192/512) handles installs. */}
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <StructuredData />
        <Providers>
          <Header />
          <main id="main-content" className="min-h-screen pt-14 md:pt-16 pb-16 lg:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}