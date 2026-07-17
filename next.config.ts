import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.onechanneladmin.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "onetruckparts.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.onetruckparts.com",
        pathname: "/**",
      },
      // Featured images often include Unsplash query params — omit `search` so any query is allowed.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
