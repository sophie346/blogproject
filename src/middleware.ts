import { NextResponse, type NextRequest } from "next/server";
import {
  normalizeHost,
  normalizePathPrefix,
  resolveSiteBinding,
  toInternalPath,
} from "@/constants/tenants";

/** Public asset prefix (must match next.config assetPrefix). */
const ASSET_PREFIX = "/blog";

const PASSTHROUGH_PREFIXES = ["/_next", "/api/health", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Browser requests /blog/_next/* (assetPrefix + images.path). Rewrite to
  // /_next/* so the built-in Image optimizer and static chunks are served.
  // Do not run tenant matching on these (would render Coming soon).
  if (
    pathname === `${ASSET_PREFIX}/_next` ||
    pathname.startsWith(`${ASSET_PREFIX}/_next/`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(ASSET_PREFIX.length) || "/";
    return NextResponse.rewrite(url);
  }

  // trailingSlash: true would 308 /api/health → /api/health/. GCP LB health
  // checks do not follow redirects, so rewrite (no redirect) to the slash URL.
  if (pathname === "/api/health") {
    const url = request.nextUrl.clone();
    url.pathname = "/api/health/";
    return NextResponse.rewrite(url);
  }

  if (
    PASSTHROUGH_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    )
  ) {
    return NextResponse.next();
  }

  const host = normalizeHost(
    request.headers.get("x-forwarded-host") || request.headers.get("host")
  );
  const site = resolveSiteBinding(host, pathname);

  const requestHeaders = new Headers(request.headers);

  if (!site) {
    requestHeaders.set("x-blog-matched", "0");
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  let internalPath = toInternalPath(site.pathPrefix, pathname);
  // next.config trailingSlash: true — page rewrites need a trailing slash;
  // keep file routes (sitemap.xml, feed.xml, robots.txt) as-is.
  const leaf = internalPath.split("/").pop() || "";
  if (
    internalPath !== "/" &&
    !internalPath.endsWith("/") &&
    leaf &&
    !leaf.includes(".")
  ) {
    internalPath = `${internalPath}/`;
  }
  const url = request.nextUrl.clone();
  url.pathname = internalPath;

  requestHeaders.set("x-blog-matched", "1");
  requestHeaders.set("x-blog-id", site.id);
  requestHeaders.set("x-blog-clientname", site.clientName);
  requestHeaders.set("x-blog-label", site.label);
  requestHeaders.set("x-blog-path-prefix", normalizePathPrefix(site.pathPrefix));
  if (site.siteUrl) {
    requestHeaders.set("x-blog-site-url", site.siteUrl.replace(/\/$/, ""));
  }
  if (site.themeId) {
    requestHeaders.set("x-blog-theme-id", site.themeId);
  }
  if (site.authToken) {
    requestHeaders.set("x-blog-auth-token", site.authToken);
  }

  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    /*
     * Include /blog/_next/* (assetPrefix) so we can rewrite to /_next/*.
     * Root /_next/* is handled by Next directly when present.
     */
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    "/blog/_next/:path*",
  ],
};
