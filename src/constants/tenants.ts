/**
 * Tenant identity for the multi-tenant blog.
 * Replaces former .env.example values (CLIENT_NAME, ONEAUTO_CLIENTNAME, WEBSITE_LABEL, …).
 * Resolve by request Host via TENANT_BY_HOST — do not use process.env.
 */

export type TenantIdentity = {
  /** UI registry key: `src/clients/<themeKey>.ts` + `src/data/themes/<themeKey>.json` */
  themeKey: string;
  /** Sent as the `clientname` request header to the BFF */
  clientName: string;
  /** Sent as the `label` header + query param for blog scoping */
  label: string;
  /** Public site origin for SEO (no trailing slash). Derived from Host if omitted. */
  siteUrl?: string;
  /** Optional Bearer token for BFF (guest /prod usually works without it) */
  authToken?: string;
};

/** Shared OneAuto BFF base (was ONEAUTO_API_BASE). */
export const BLOG_API_BASE = "https://backend.oneauto.us";

/** Fallback when Host is unknown (local / health probes). */
export const DEFAULT_HOST = "localhost";

/**
 * Known clients — same options as old CLIENT_NAME=oneauto|nexus.
 * Add new clients here, then map hosts in TENANT_BY_HOST.
 */
export const TENANTS = {
  oneauto: {
    themeKey: "oneauto",
    clientName: "oneauto",
    label: "oneauto",
  },
  nexus: {
    themeKey: "nexus",
    clientName: "1p0248qcm3j1k401",
    label: "nexus",
  },
} as const satisfies Record<string, TenantIdentity>;

export type TenantKey = keyof typeof TENANTS;

/**
 * Host → tenant. Add apex + www as you onboard each client.
 */
export const TENANT_BY_HOST: Record<string, TenantIdentity> = {
  // --- OneAuto ---
  "onetruckparts.com": {
    ...TENANTS.oneauto,
    siteUrl: "https://onetruckparts.com",
  },
  "www.onetruckparts.com": {
    ...TENANTS.oneauto,
    siteUrl: "https://www.onetruckparts.com",
  },

  // --- Nexus ---
  "nexustruckupgrades.com": {
    ...TENANTS.nexus,
    siteUrl: "https://nexustruckupgrades.com",
  },
  "www.nexustruckupgrades.com": {
    ...TENANTS.nexus,
    siteUrl: "https://www.nexustruckupgrades.com",
  },

  // Local (was CLIENT_NAME=oneauto in .env.example)
  localhost: {
    ...TENANTS.oneauto,
    siteUrl: "http://localhost:3000",
  },
  "127.0.0.1": {
    ...TENANTS.oneauto,
    siteUrl: "http://127.0.0.1:3000",
  },
};

export function normalizeHost(host: string | null | undefined): string {
  if (!host) return DEFAULT_HOST;
  return host.split(":")[0].trim().toLowerCase();
}

export function resolveTenantMapping(
  host: string | null | undefined
): TenantIdentity {
  const key = normalizeHost(host);
  return TENANT_BY_HOST[key] || TENANT_BY_HOST[DEFAULT_HOST];
}
