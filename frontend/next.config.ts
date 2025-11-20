import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Add production Strapi URL if available
      ...(process.env.STRAPI_BASE_URL
        ? [
            {
              protocol: new URL(process.env.STRAPI_BASE_URL).protocol.replace(
                ":",
                ""
              ) as "http" | "https",
              hostname: new URL(process.env.STRAPI_BASE_URL).hostname,
              port: new URL(process.env.STRAPI_BASE_URL).port,
              pathname: "/uploads/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
