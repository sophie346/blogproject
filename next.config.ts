import type { NextConfig } from "next";

/**
 * Shared hosts mount the app under a path (e.g. onetruckparts.com/blog).
 * Without assetPrefix, CSS/JS load from /_next/* which hits the storefront → 404.
 *
 * Assets always use /blog/_next/* (see LB: route /blog/_next to commonblog).
 * Temp mounts like /blogstemp keep this asset prefix — pages are under /blogstemp,
 * but CSS/JS/images still load from /blog/_next/* so WordPress can keep /blog.
 */
const ASSET_PREFIX = "/blog";

const nextConfig: NextConfig = {
  assetPrefix: ASSET_PREFIX,
  // Match WordPress permalinks (/blog/slug/) for SEO cutover / 301 parity.
  trailingSlash: true,
  images: {
    // Prefix Image optimizer URLs for shared hosts (do NOT use loaderFile —
    // that disables the built-in /_next/image API and 404s as Coming soon).
    path: `${ASSET_PREFIX}/_next/image`,
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
  async rewrites() {
    // Browser requests /blog/_next/* (assetPrefix + images.path); app serves /_next/*.
    return [
      {
        source: `${ASSET_PREFIX}/_next/:path*`,
        destination: "/_next/:path*",
      },
    ];
  },
};

export default nextConfig;
