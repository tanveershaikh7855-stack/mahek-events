import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    minimumCacheTTL: 86400,
  },
  experimental: {
    // Only packages actually imported by this project. `@radix-ui/react-icons`
    // and `recharts` were listed here but appear in no source file.
    optimizePackageImports: ["framer-motion", "lucide-react", "@base-ui/react"],
    serverActions: {
      // Admin image uploads are posted inline as base64 data URLs. The default
      // 1 MB Server Action body cap rejected them, so saving a product with a
      // photo failed silently.
      bodySizeLimit: "12mb",
    },
  },
  // `typescript.ignoreBuildErrors: true` was set here, which let 16 real type
  // errors ship. Those are fixed; the escape hatch is gone so they cannot
  // silently come back.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Hostinger's CDN (hcdn) caches responses by URL only. Next.js
          // serves either HTML or the RSC flight payload at the same URL
          // depending on request headers — without Vary, the CDN mixes them
          // and users randomly see raw RSC text like `:HL["/_next/…"]…`
          // instead of the page. Telling the CDN to key on these headers
          // stores them as separate cache entries.
          {
            key: "Vary",
            value:
              "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url, Accept-Encoding",
          },
        ],
      },
      {
        // Admin should never be edge-cached — cookies, live data, and CSRF
        // tokens must not be shared between users.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
