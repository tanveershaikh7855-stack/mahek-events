import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { seo, business } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
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
    url: seo.siteUrl,
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
  verification: {
    google: "google-site-verification-code",
  },
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
        <link rel="icon" href="/images/logo/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo/logo.png" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
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