import { cache } from "react";
import { headers } from "next/headers";
import { clients } from "@/clients";
import {
  BLOG_API_BASE,
  DEFAULT_HOST,
  resolveTenantMapping,
} from "@/constants/tenants";
import { DEFAULT_CLIENT } from "@/constants/client";
import { loadTheme } from "@/lib/load-theme";
import type { ClientDefinition, TenantConfig } from "@/types/tenant";

async function readRequestHost(): Promise<string> {
  const h = await headers();
  const raw = h.get("x-forwarded-host") || h.get("host") || DEFAULT_HOST;
  return raw.split(",")[0].trim();
}

function resolveDefinition(themeKey: string): ClientDefinition {
  return clients[themeKey] || clients[DEFAULT_CLIENT];
}

/** Active tenant for this request (Host → constants/tenants). Cached per request. */
export const getTenant = cache(async (): Promise<TenantConfig> => {
  const host = await readRequestHost();
  const mapping = resolveTenantMapping(host);
  const themeKey = mapping.themeKey || DEFAULT_CLIENT;
  const def = resolveDefinition(themeKey);
  const theme = loadTheme(themeKey);
  const { theme: _ignored, ...rest } = def;

  const siteUrl = (
    mapping.siteUrl || `https://${host.replace(/:\d+$/, "")}`
  ).replace(/\/$/, "");

  return {
    ...rest,
    clientName: mapping.clientName,
    label: mapping.label,
    siteUrl,
    theme,
  };
});

/** BFF connection + identity headers for this request. */
export const getApiConfig = cache(async () => {
  const tenant = await getTenant();
  const mapping = resolveTenantMapping(await readRequestHost());

  return {
    apiBase: BLOG_API_BASE.replace(/\/$/, ""),
    clientName: tenant.clientName,
    label: tenant.label,
    authToken: mapping.authToken || "",
  };
});
