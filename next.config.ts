import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  experimental: {
    // Only packages actually imported by this project. `@radix-ui/react-icons`
    // and `recharts` were listed here but appear in no source file.
    optimizePackageImports: ["framer-motion", "lucide-react", "@base-ui/react"],
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
        ],
      },
    ];
  },
};

export default nextConfig;
