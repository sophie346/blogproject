import { NextResponse, type NextRequest } from "next/server";
import {
  normalizeHost,
  normalizePathPrefix,
  resolveSiteBinding,
  toInternalPath,
} from "@/constants/tenants";

const PASSTHROUGH_PREFIXES = ["/_next", "/api/health", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Asset prefix URLs (/blog/_next/*) are rewritten in next.config; do not
  // run tenant matching on them (would 404 Image optimizer as Coming soon).
  if (
    pathname === "/blog/_next" ||
    pathname.startsWith("/blog/_next/") ||
    PASSTHROUGH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
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

  const internalPath = toInternalPath(site.pathPrefix, pathname);
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
    "/((?!_next/static|_next/image|blog/_next/static|blog/_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
