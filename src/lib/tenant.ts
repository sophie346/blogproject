import { cache } from "react";
import { headers } from "next/headers";
import { clients } from "@/clients";
import { BLOG_API_BASE, type SiteBinding } from "@/constants/tenants";
import { DEFAULT_CLIENT } from "@/constants/client";
import { loadTheme } from "@/lib/load-theme";
import type { ClientDefinition, TenantConfig } from "@/types/tenant";

async function readBlogHeaders() {
  const h = await headers();
  return {
    matched: h.get("x-blog-matched") === "1",
    id: h.get("x-blog-id") || "",
    clientName: h.get("x-blog-clientname") || "",
    label: h.get("x-blog-label") || "",
    themeKey: h.get("x-blog-theme-key") || "",
    pathPrefix: h.get("x-blog-path-prefix") || "",
    siteUrl: h.get("x-blog-site-url") || "",
    authToken: h.get("x-blog-auth-token") || "",
    host: (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim(),
  };
}

function resolveDefinition(themeKey: string): ClientDefinition {
  return clients[themeKey] || clients[DEFAULT_CLIENT];
}

function buildTenant(
  mapping: Pick<
    SiteBinding,
    "themeKey" | "clientName" | "label" | "siteUrl" | "pathPrefix"
  > & { pathPrefix: string },
  host: string
): TenantConfig {
  const themeKey = mapping.themeKey || DEFAULT_CLIENT;
  const def = resolveDefinition(themeKey);
  const theme = loadTheme(themeKey);
  const { theme: _ignored, ...rest } = def;

  const prefix = mapping.pathPrefix || "";
  const siteUrl = (
    mapping.siteUrl ||
    `https://${host.replace(/:\d+$/, "")}${prefix}`
  ).replace(/\/$/, "");

  return {
    ...rest,
    clientName: mapping.clientName,
    label: mapping.label,
    siteUrl,
    pathPrefix: prefix,
    theme,
  };
}

/** Site for this request (Host + pathPrefix via middleware), or null → Coming soon. */
export const getTenantOrNull = cache(async (): Promise<TenantConfig | null> => {
  const meta = await readBlogHeaders();
  if (!meta.matched || !meta.clientName || !meta.label) return null;

  return buildTenant(
    {
      themeKey: meta.themeKey || DEFAULT_CLIENT,
      clientName: meta.clientName,
      label: meta.label,
      siteUrl: meta.siteUrl || undefined,
      pathPrefix: meta.pathPrefix,
    },
    meta.host
  );
});

export const getTenant = cache(async (): Promise<TenantConfig> => {
  const tenant = await getTenantOrNull();
  if (!tenant) {
    throw new Error("Unknown host/path — site is not configured");
  }
  return tenant;
});

/** BFF headers: `clientname` (org) + `label` (website). */
export const getApiConfig = cache(async () => {
  const tenant = await getTenantOrNull();
  const meta = await readBlogHeaders();
  if (!tenant) {
    return {
      apiBase: BLOG_API_BASE.replace(/\/$/, ""),
      clientName: "",
      label: "",
      authToken: "",
    };
  }

  return {
    apiBase: BLOG_API_BASE.replace(/\/$/, ""),
    clientName: tenant.clientName,
    label: tenant.label,
    authToken: meta.authToken || "",
  };
});
