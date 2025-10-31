import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
  outputFileTracingRoot: resolve(__dirname),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.communitydragon.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "ddragon.leagueoflegends.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
