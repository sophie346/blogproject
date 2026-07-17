import type { ThemeConfig, ThemeId } from "@/types/theme";
import defaultTheme from "@/data/themes/default.json";
import modernTheme from "@/data/themes/modern.json";

/**
 * Local CSS token presets keyed by theme id from blog settings.
 * Settings may also send custom `tokens` which merge on top.
 */
const THEME_PRESETS: Record<string, ThemeConfig> = {
  default: defaultTheme as ThemeConfig,
  modern: modernTheme as ThemeConfig,
  luxury: {
    id: "luxury",
    tokens: (defaultTheme as ThemeConfig).tokens,
  },
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
 * Resolve theme: preset by id, then overlay any custom tokens from settings.
 */
export function loadTheme(
  themeId: string,
  customTokens?: ThemeConfig["tokens"]
): ThemeConfig {
  const key = (themeId || "default").trim().toLowerCase();
  const preset = normalizeTheme(THEME_PRESETS[key] || THEME_PRESETS.default);
  return {
    id: (["default", "modern", "luxury"].includes(key)
      ? key
      : preset.id) as ThemeId,
    tokens: {
      ...(preset.tokens || {}),
      ...(customTokens || {}),
    },
  };
}

export function listThemePresets(): string[] {
  return Object.keys(THEME_PRESETS);
}
