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
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "framer-motion",
      "lucide-react",
      "recharts",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
};

export default nextConfig;
