import { clients } from "@/clients";
import { CLIENT_NAME, DEFAULT_CLIENT } from "@/constants/client";
import { loadTheme } from "@/lib/load-theme";
import type { ClientDefinition, TenantConfig } from "@/types/tenant";

/** Normalize env values that may include quotes / trailing semicolons. */
function env(name: string, fallback = "") {
  const raw = process.env[name];
  if (raw == null) return fallback;
  return String(raw)
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/;+\s*$/g, "")
    .trim();
}

function resolveDefinition(): ClientDefinition {
  return clients[CLIENT_NAME] || clients[DEFAULT_CLIENT];
}

let cached: TenantConfig | null = null;

/** Resolve the active tenant: client definition + theme JSON + env identity. */
export function getTenant(): TenantConfig {
  if (cached) return cached;

  const def = resolveDefinition();

  const clientName =
    env("ONEAUTO_CLIENTNAME") || def.clientName || CLIENT_NAME || DEFAULT_CLIENT;
  const label = env("WEBSITE_LABEL") || def.label || clientName;

  // Theme CSS values: keyed by UI CLIENT_NAME (JSON today → API later).
  const theme = loadTheme(CLIENT_NAME || def.clientName || DEFAULT_CLIENT);

  const { theme: _ignoredTheme, ...rest } = def;

  cached = {
    ...rest,
    clientName,
    label,
    theme,
  } as TenantConfig;

  return cached;
}

/** BFF connection config, kept separate so it can stay server-only. */
export function getApiConfig() {
  const apiBase = (
    env("ONEAUTO_API_BASE", "http://127.0.0.1:3005") || ""
  ).replace(/\/$/, "");
  const authToken = env("ONEAUTO_AUTH_TOKEN");
  const tenant = getTenant();

  return {
    apiBase,
    clientName: tenant.clientName,
    label: tenant.label,
    authToken,
  };
}
