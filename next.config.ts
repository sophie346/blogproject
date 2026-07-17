import type { NextConfig } from "next";

/**
 * Shared hosts mount the app under a path (e.g. onetruckparts.com/blog).
 * Without assetPrefix, CSS/JS load from /_next/* which hits the storefront → 404.
 * Assets are always under /blog/_next/* (see LB: route /blog/_next to commonblog).
 * Temp mounts like /blogstemp still use this asset prefix — LB must send /blog/_next/* here.
 */
const ASSET_PREFIX = "/blog";

const nextConfig: NextConfig = {
  assetPrefix: ASSET_PREFIX,
  images: {
    // assetPrefix alone does NOT prefix <Image> optimizer URLs in this Next version.
    // Custom loader forces /blog/_next/image so LB hits commonblog (not storefront /_next).
    loader: "custom",
    // Must live at repo root — Docker runner copies this beside next.config.ts (no /src).
    loaderFile: "./image-loader.ts",
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
      {
        protocol: "https",
        hostname: "nexustruckupgrades.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.nexustruckupgrades.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.nexustruckupgrades.com",
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
