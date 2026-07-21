import type { ThemeConfig, ThemeId } from "@/types/theme";
import {
  DEFAULT_THEME_ID,
  getThemePackage,
  listThemeIds,
} from "@/themes/registry";

/**
 * Load theme config (tokens) from the theme folder’s theme.json,
 * then merge any admin/API custom tokens + customCss + heroLayout on top.
 */
export function loadTheme(
  themeId: string,
  customTokens?: ThemeConfig["tokens"],
  customCss?: string,
  heroLayout?: ThemeConfig["heroLayout"]
): ThemeConfig {
  const pack = getThemePackage(themeId);
  const id = (pack.config.id || DEFAULT_THEME_ID) as ThemeId;
  const layout = String(heroLayout || "")
    .trim()
    .toLowerCase();
  return {
    id,
    tokens: {
      ...(pack.config.tokens || {}),
      ...(customTokens || {}),
    },
    heroLayout: (["split", "centered", "marketing"].includes(layout)
      ? (layout as ThemeConfig["heroLayout"])
      : undefined),
    customCss: customCss || "",
  };
}

export function listThemePresets(): string[] {
  return listThemeIds();
}
