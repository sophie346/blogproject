/**
 * Host + pathPrefix → site binding.
 *
 * BFF identity (same as B2B Website Setup / WebsiteRoutes/blogs.js):
 * - `clientName` → header `clientname` (organization)
 * - `label` → header + query `label` (website; one org can have many)
 *
 * Multiple blogs on one domain: different `pathPrefix` values
 * (e.g. `/blog`, `/blogs`, `/blogs2`), each with its own clientName + label.
 *
 * Unknown Host/path → Coming soon. `/api/health` is always allowed.
 */

export type SiteBinding = {
  /** Stable id for debugging */
  id: string;
  /** Hostnames that match this site (no port) */
  hosts: string[];
  /**
   * URL prefix where this blog is mounted.
   * `/` = site root. `/blog` = https://host/blog. `/blogs2` = another blog on same host.
   */
  pathPrefix: string;
  /** UI theme + brand (`src/clients/<themeKey>.ts`) */
  themeKey: string;
  /** Org id — BFF header `clientname` */
  clientName: string;
  /** Website label — BFF header + query `label` */
  label: string;
  /** Public origin including pathPrefix for SEO (no trailing slash) */
  siteUrl?: string;
  authToken?: string;
};

/** Shared storefront BFF base. */
export const BLOG_API_BASE = "https://backend.oneauto.us";

export const ORGANIZATIONS = {
  oneauto: { clientName: "oneauto" },
  nexus: { clientName: "1p0248qcm3j1k401" },
} as const;

const ONEAUTO = {
  themeKey: "oneauto",
  clientName: ORGANIZATIONS.oneauto.clientName,
  label: "oneauto",
} as const;

const NEXUS = {
  themeKey: "nexus",
  clientName: ORGANIZATIONS.nexus.clientName,
  label: "nexus",
} as const;

/**
 * Onboarded sites. Longest matching pathPrefix wins for a Host.
 *
 * Add another blog on the same host by copying a row with a new pathPrefix
 * + label (and themeKey if needed), e.g. pathPrefix: "/blogs2".
 */
export const SITES: SiteBinding[] = [
  // --- OneAuto (local test at site root) ---
  {
    id: "oneauto-local-root",
    hosts: ["localhost", "127.0.0.1"],
    pathPrefix: "/",
    ...ONEAUTO,
    siteUrl: "http://localhost:3000",
  },
  // --- OneAuto at /blog (local + onetruckparts) ---
  {
    id: "oneauto-local-blog",
    hosts: ["localhost", "127.0.0.1"],
    pathPrefix: "/blog",
    ...ONEAUTO,
    siteUrl: "http://localhost:3000/blog",
  },
  {
    id: "oneauto-onetruckparts-blog",
    hosts: ["onetruckparts.com", "www.onetruckparts.com"],
    pathPrefix: "/blog",
    ...ONEAUTO,
    siteUrl: "https://onetruckparts.com/blog",
  },

  // --- Nexus at /blog ---
  {
    id: "nexus-blog",
    hosts: ["nexustruckupgrades.com", "www.nexustruckupgrades.com"],
    pathPrefix: "/blog",
    ...NEXUS,
    siteUrl: "https://nexustruckupgrades.com/blog",
  },

  // Example second blog on same host (uncomment / edit label when ready):
  // {
  //   id: "oneauto-local-blogs2",
  //   hosts: ["localhost", "127.0.0.1"],
  //   pathPrefix: "/blogs2",
  //   themeKey: "oneauto",
  //   clientName: ORGANIZATIONS.oneauto.clientName,
  //   label: "another-website-label",
  //   siteUrl: "http://localhost:3000/blogs2",
  // },
];

export function normalizeHost(host: string | null | undefined): string {
  if (!host) return "";
  return host.split(":")[0].trim().toLowerCase();
}

/** Normalize pathPrefix to `""` for root or `/foo` without trailing slash. */
export function normalizePathPrefix(prefix: string | null | undefined): string {
  if (!prefix || prefix === "/") return "";
  const withSlash = prefix.startsWith("/") ? prefix : `/${prefix}`;
  return withSlash.replace(/\/+$/, "") || "";
}

export function normalizePathname(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  const path = pathname.split("?")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1) || "/";
  return path || "/";
}

function pathMatches(pathname: string, pathPrefix: string): boolean {
  const prefix = normalizePathPrefix(pathPrefix);
  const path = normalizePathname(pathname);
  if (!prefix) return true; // root mount matches all paths on that host (longest prefix still wins)
  return path === prefix || path.startsWith(`${prefix}/`);
}

/**
 * Resolve site from Host + pathname. Longest pathPrefix wins.
 * Returns null → Coming soon.
 */
export function resolveSiteBinding(
  host: string | null | undefined,
  pathname: string | null | undefined = "/"
): SiteBinding | null {
  const hostKey = normalizeHost(host);
  if (!hostKey) return null;

  const path = normalizePathname(pathname);
  const matches = SITES.filter(
    (site) =>
      site.hosts.some((h) => normalizeHost(h) === hostKey) &&
      pathMatches(path, site.pathPrefix)
  );

  if (!matches.length) return null;

  matches.sort(
    (a, b) =>
      normalizePathPrefix(b.pathPrefix).length -
      normalizePathPrefix(a.pathPrefix).length
  );
  return matches[0];
}

/** Map public URL under a site prefix to an internal App Router path. */
export function toInternalPath(pathPrefix: string, pathname: string): string {
  const prefix = normalizePathPrefix(pathPrefix);
  const path = normalizePathname(pathname);

  if (!prefix) return path === "" ? "/" : path;

  let rest =
    path === prefix ? "/" : path.startsWith(`${prefix}/`) ? path.slice(prefix.length) : path;
  if (!rest.startsWith("/")) rest = `/${rest}`;
  if (rest === "/") return "/";

  const segment = rest.split("/").filter(Boolean)[0] || "";
  const reserved = new Set([
    "category",
    "author",
    "tag",
    "api",
    "feed.xml",
    "_next",
    "__coming-soon",
  ]);

  if (reserved.has(segment)) return rest;

  // Single segment (or /slug/...) under a non-root mount → article route /blog/[slug]
  if (prefix !== "/blog") {
    return `/blog${rest}`;
  }

  // Mounted at /blog: /blog/slug is already the internal article route
  return `/blog${rest}`;
}

/**
 * Build a public path for links/SEO from an internal app path.
 * Internal: `/`, `/blog/slug`, `/category/x`
 * Public depends on pathPrefix (`/blog`, `/blogs`, `/`, …).
 */
export function toPublicPath(pathPrefix: string, appPath: string): string {
  const prefix = normalizePathPrefix(pathPrefix);
  let path = appPath.startsWith("/") ? appPath : `/${appPath}`;

  if (path.startsWith("/blog/")) {
    const slugPart = path.slice("/blog".length); // /slug
    if (!prefix) return `/blog${slugPart}`;
    return `${prefix}${slugPart}`;
  }

  if (path === "/" || path === "") {
    return prefix || "/";
  }

  return `${prefix}${path}`;
}
