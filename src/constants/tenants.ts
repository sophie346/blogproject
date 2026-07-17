/**
 * Host + pathPrefix → BFF identity (`clientName` + `label`).
 *
 * Brand/copy/theme come from ChannelAdmin blog settings
 * (`GET /prod/blog-settings`), not from static client modules.
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
   * `/` = site root. `/blog` = https://host/blog.
   */
  pathPrefix: string;
  /** Org id — BFF header `clientname` */
  clientName: string;
  /** Website label — BFF header + query `label` */
  label: string;
  /** Public origin including pathPrefix for SEO (no trailing slash) */
  siteUrl?: string;
  authToken?: string;
  /**
   * Optional theme override for this mount (wins over ChannelAdmin settings).
   * Useful for temp path tests (e.g. /blogstemp).
   */
  themeId?: "default" | "modern" | "luxury";
};

/** Shared storefront BFF base. */
export const BLOG_API_BASE = "https://backend.oneauto.us";

/**
 * Onboarded sites. Longest matching pathPrefix wins for a Host.
 *
 * Add another blog on the same host with a new pathPrefix + label.
 */
export const SITES: SiteBinding[] = [
  {
    id: "oneauto-local-root",
    hosts: ["localhost", "127.0.0.1"],
    pathPrefix: "/",
    clientName: "oneauto",
    label: "oneauto",
    siteUrl: "http://localhost:3000",
  },
  {
    id: "oneauto-local-blog",
    hosts: ["localhost", "127.0.0.1"],
    pathPrefix: "/blog",
    clientName: "oneauto",
    label: "oneauto",
    siteUrl: "http://localhost:3000/blog",
  },
  {
    id: "oneauto-onetruckparts-blog",
    hosts: ["onetruckparts.com", "www.onetruckparts.com"],
    pathPrefix: "/blog",
    clientName: "oneauto",
    label: "oneauto",
    siteUrl: "https://onetruckparts.com/blog",
  },
  // Temp test mount — LB /blogstemp → commonblog; WordPress stays on /blog.
  {
    id: "nexustruckupgrades-blogstemp",
    hosts: ["nexustruckupgrades.com", "www.nexustruckupgrades.com"],
    pathPrefix: "/blogstemp",
    clientName: "1p0248qcm3j1k401",
    label: "nexus",
    siteUrl: "https://nexustruckupgrades.com/blogstemp",
    themeId: "modern",
  },
  // Future cutover target (LB still sends /blog → WordPress VM).
  {
    id: "nexustruckupgrades-blog",
    hosts: ["nexustruckupgrades.com", "www.nexustruckupgrades.com"],
    pathPrefix: "/blog",
    clientName: "1p0248qcm3j1k401",
    label: "nexus",
    siteUrl: "https://nexustruckupgrades.com/blog",
    themeId: "modern",
  },
  {
    id: "onedirectbuy-blog",
    hosts: ["onedirectbuy.com", "www.onedirectbuy.com"],
    pathPrefix: "/blog",
    clientName: "3at1mrm65w3g",
    label: "onedirectbuy",
    siteUrl: "https://onedirectbuy.com/blog",
  },
  {
    id: "oneproducthub-blog",
    hosts: ["oneproducthub.com", "www.oneproducthub.com"],
    pathPrefix: "/blog",
    clientName: "3at1mrm65w3g",
    label: "oneproducthub",
    siteUrl: "https://oneproducthub.com/blog",
  },

  // Example second blog on same host:
  // {
  //   id: "oneauto-local-blogs2",
  //   hosts: ["localhost", "127.0.0.1"],
  //   pathPrefix: "/blogs2",
  //   clientName: "oneauto",
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
  if (!prefix) return true;
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
    "sitemap.xml",
    "robots.txt",
    "_next",
    "__coming-soon",
  ]);

  if (reserved.has(segment)) return rest;

  if (prefix !== "/blog") {
    return `/blog${rest}`;
  }

  return `/blog${rest}`;
}

/**
 * Build a public path for links/SEO from an internal app path.
 */
export function toPublicPath(pathPrefix: string, appPath: string): string {
  const prefix = normalizePathPrefix(pathPrefix);
  let path = appPath.startsWith("/") ? appPath : `/${appPath}`;

  let out: string;
  if (path.startsWith("/blog/")) {
    const slugPart = path.slice("/blog".length);
    if (!prefix) out = `/blog${slugPart}`;
    else out = `${prefix}${slugPart}`;
  } else if (path === "/" || path === "") {
    out = prefix || "/";
  } else {
    out = `${prefix}${path}`;
  }

  // Trailing slash for page URLs (WordPress parity / next.config trailingSlash).
  const leaf = out.split("/").pop() || "";
  if (out !== "/" && !out.endsWith("/") && leaf && !leaf.includes(".")) {
    out = `${out}/`;
  }
  return out;
}
