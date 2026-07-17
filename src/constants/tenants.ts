/**
 * Host + pathPrefix → which client module to use.
 *
 * Org identity (`clientName`) and website `label` live only on the client
 * definition (`src/clients/<name>.ts`). This file only mounts hosts/paths.
 *
 * Optional per-site `label` override when one org has multiple websites.
 * Unknown Host/path → Coming soon. `/api/health` is always allowed.
 */

import { clients } from "@/clients";
import { DEFAULT_CLIENT } from "@/constants/client";
import oneauto from "@/clients/oneauto";
import nexus from "@/clients/nexus";
import type { ClientDefinition } from "@/types/tenant";

/** Declared mount — points at a client module; does not repeat org identity. */
export type SiteMount = {
  id: string;
  hosts: string[];
  pathPrefix: string;
  /** Client definition from `src/clients/*` (single source of identity + brand). */
  client: ClientDefinition;
  /** Override website label when the same org has multiple sites. */
  label?: string;
  siteUrl?: string;
  authToken?: string;
};

/** Resolved mount with BFF identity filled from the client definition. */
export type SiteBinding = {
  id: string;
  hosts: string[];
  pathPrefix: string;
  themeKey: string;
  clientName: string;
  label: string;
  siteUrl?: string;
  authToken?: string;
};

/** Shared storefront BFF base. */
export const BLOG_API_BASE = "https://backend.oneauto.us";

function themeKeyOf(client: ClientDefinition): string {
  const entry = Object.entries(clients).find(([, def]) => def === client);
  return entry?.[0] || client.label || DEFAULT_CLIENT;
}

function toBinding(mount: SiteMount): SiteBinding | null {
  const clientName = mount.client.clientName?.trim();
  const label = (mount.label ?? mount.client.label)?.trim();
  if (!clientName || !label) return null;

  return {
    id: mount.id,
    hosts: mount.hosts,
    pathPrefix: mount.pathPrefix,
    themeKey: themeKeyOf(mount.client),
    clientName,
    label,
    siteUrl: mount.siteUrl,
    authToken: mount.authToken,
  };
}

/**
 * Onboarded sites. Longest matching pathPrefix wins for a Host.
 *
 * Add another blog on the same host by copying a row with a new pathPrefix
 * (and optional `label` override). Identity stays on the client module.
 */
const SITE_MOUNTS: SiteMount[] = [
  {
    id: "oneauto-local-root",
    hosts: ["localhost", "127.0.0.1"],
    pathPrefix: "/",
    client: oneauto,
    siteUrl: "http://localhost:3000",
  },
  {
    id: "oneauto-local-blog",
    hosts: ["localhost", "127.0.0.1"],
    pathPrefix: "/blog",
    client: oneauto,
    siteUrl: "http://localhost:3000/blog",
  },
  {
    id: "oneauto-onetruckparts-blog",
    hosts: ["onetruckparts.com", "www.onetruckparts.com"],
    pathPrefix: "/blog",
    client: oneauto,
    siteUrl: "https://onetruckparts.com/blog",
  },
  {
    id: "nexustruckupgrades-blog",
    hosts: ["nexustruckupgrades.com", "www.nexustruckupgrades.com"],
    pathPrefix: "/blog",
    client: nexus,
    siteUrl: "https://nexustruckupgrades.com/blog",
  },

  // Example second blog on same host (uncomment / edit label when ready):
  // {
  //   id: "oneauto-local-blogs2",
  //   hosts: ["localhost", "127.0.0.1"],
  //   pathPrefix: "/blogs2",
  //   client: oneauto,
  //   label: "another-website-label",
  //   siteUrl: "http://localhost:3000/blogs2",
  // },
];

export const SITES: SiteBinding[] = SITE_MOUNTS.map(toBinding).filter(
  (site): site is SiteBinding => site !== null
);

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
