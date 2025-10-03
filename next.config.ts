import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
