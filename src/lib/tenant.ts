import { cache } from "react";
import { headers } from "next/headers";
import { BLOG_API_BASE, type SiteBinding } from "@/constants/tenants";
import { loadTheme } from "@/lib/load-theme";
import { fetchBlogSettings } from "@/services/blog-settings";
import type { TenantConfig } from "@/types/tenant";

async function readBlogHeaders() {
  const h = await headers();
  return {
    matched: h.get("x-blog-matched") === "1",
    id: h.get("x-blog-id") || "",
    clientName: h.get("x-blog-clientname") || "",
    label: h.get("x-blog-label") || "",
    pathPrefix: h.get("x-blog-path-prefix") || "",
    siteUrl: h.get("x-blog-site-url") || "",
    authToken: h.get("x-blog-auth-token") || "",
    host: (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim(),
  };
}

async function buildTenant(
  mapping: Pick<SiteBinding, "clientName" | "label" | "siteUrl" | "pathPrefix"> & {
    pathPrefix: string;
  },
  host: string,
  authToken: string
): Promise<TenantConfig> {
  const settings = await fetchBlogSettings(
    mapping.clientName,
    mapping.label,
    authToken
  );
  const { theme: settingsTheme, ...rest } = settings;
  const theme = loadTheme(
    settingsTheme?.id || "default",
    settingsTheme?.tokens,
    settingsTheme?.customCss
  );

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
      clientName: meta.clientName,
      label: meta.label,
      siteUrl: meta.siteUrl || undefined,
      pathPrefix: meta.pathPrefix,
    },
    meta.host,
    meta.authToken
  );
});

export const getTenant = cache(async (): Promise<TenantConfig> => {
  const tenant = await getTenantOrNull();
  if (!tenant) {
    throw new Error("Unknown host/path — site is not configured");
  }
  return tenant;
});

/** BFF headers: `clientname` (org) + `label` (website). Identity from mount headers. */
export const getApiConfig = cache(async () => {
  const meta = await readBlogHeaders();
  return {
    apiBase: BLOG_API_BASE.replace(/\/$/, ""),
    clientName: meta.matched ? meta.clientName : "",
    label: meta.matched ? meta.label : "",
    authToken: meta.authToken || "",
  };
});
