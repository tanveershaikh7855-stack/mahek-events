import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans, Poppins } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mahekdecor.com"),
  title: {
    default: "Mahek Decorator | Premium Helium Balloons & Decoration Services",
    template: "%s | Mahek Decorator",
  },
  description:
    "Premium helium balloons, balloon bouquets, party supplies and luxury decoration services. Same-day delivery within 140 KM. Book decorations online.",
  keywords: [
    "helium balloons",
    "balloon bouquets",
    "balloon decoration",
    "party supplies",
    "birthday decoration",
    "wedding decoration",
    "flower bouquets",
    "same day delivery",
  ],
  authors: [{ name: "Mahek Decorator" }],
  creator: "Mahek Decorator",
  publisher: "Mahek Decorator",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mahekdecor.com",
    siteName: "Mahek Decorator",
    title: "Mahek Decorator | Premium Helium Balloons & Decoration Services",
    description:
      "Premium helium balloons, balloon bouquets, party supplies and luxury decoration services. Same-day delivery within 140 KM.",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "Mahek Decorator - Premium Balloons & Decorations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahek Decorator | Premium Helium Balloons & Decoration Services",
    description:
      "Premium helium balloons, balloon bouquets, party supplies and luxury decoration services. Same-day delivery within 140 KM.",
    images: ["/images/logo/logo.png"],
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
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${poppins.variable}`}>
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
          <main id="main-content" className="min-h-screen pt-16 md:pt-18">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}