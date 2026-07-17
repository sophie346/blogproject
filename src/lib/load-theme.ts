import type { ThemeConfig, ThemeId } from "@/types/theme";
import { DEFAULT_CLIENT } from "@/constants/client";
import oneautoTheme from "@/data/themes/oneauto.json";
import nexusTheme from "@/data/themes/nexus.json";

/**
 * Local theme registry — stand-in for a future tenant theme API.
 * Replace `loadTheme` body with a fetch to your DB/BFF when ready;
 * keep the same ThemeConfig return shape.
 */
const THEME_FILES: Record<string, ThemeConfig> = {
  oneauto: oneautoTheme as ThemeConfig,
  nexus: nexusTheme as ThemeConfig,
};

const FALLBACK_THEME: ThemeConfig = {
  id: "default",
  tokens: {},
};

function normalizeTheme(raw: ThemeConfig | undefined): ThemeConfig {
  if (!raw) return FALLBACK_THEME;
  const id = (raw.id || "default") as ThemeId;
  return {
    id,
    tokens: raw.tokens ? { ...raw.tokens } : {},
  };
}

/**
 * Load CSS theme values for a tenant.
 * Today: JSON files under `src/data/themes/<client>.json`.
 * Later: swap this for `fetch(\`${api}/tenants/${clientName}/theme\`)`.
 */
export function loadTheme(clientName: string): ThemeConfig {
  const key = (clientName || DEFAULT_CLIENT).trim().toLowerCase();
  return normalizeTheme(THEME_FILES[key] || THEME_FILES[DEFAULT_CLIENT]);
}

/** Exposed for tests / admin tooling. */
export function listThemeClients(): string[] {
  return Object.keys(THEME_FILES);
}
