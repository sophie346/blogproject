import type { NextConfig } from "next";

/**
 * Shared hosts mount the app under a path (e.g. onetruckparts.com/blog).
 * Without assetPrefix, CSS/JS load from /_next/* which hits the storefront → 404.
 *
 * Assets always use /blog/_next/* so shared hosts can route static assets
 * to commonblog without colliding with the storefront `/_next/*`.
 */
const ASSET_PREFIX = "/blog";

const nextConfig: NextConfig = {
  assetPrefix: ASSET_PREFIX,
  // Match WordPress permalinks (/blog/slug/) for SEO cutover / 301 parity.
  trailingSlash: true,
  // Do not 308 /api/health → /api/health/ (GCP LB health checks reject redirects).
  // Page trailing slashes are still enforced in middleware rewrites.
  skipTrailingSlashRedirect: true,
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
      {
        protocol: "https",
        hostname: "onedirectbuy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.onedirectbuy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.onedirectbuy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oneproducthub.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.oneproducthub.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.oneproducthub.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "onechanneladmin.info",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.onechanneladmin.info",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.onechanneladmin.info",
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
