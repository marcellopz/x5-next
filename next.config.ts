import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  outputFileTracingRoot: resolve(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 28, 32, 40, 48, 64, 80, 96],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.communitydragon.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s-lol-web.op.gg",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
