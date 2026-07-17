import type { ThemeConfig, ThemeId } from "@/types/theme";
import {
  DEFAULT_THEME_ID,
  getThemePackage,
  listThemeIds,
} from "@/themes/registry";

/**
 * Load theme config (tokens) from the theme folder’s theme.json,
 * then merge any admin/API custom tokens + customCss on top.
 */
export function loadTheme(
  themeId: string,
  customTokens?: ThemeConfig["tokens"],
  customCss?: string
): ThemeConfig {
  const pack = getThemePackage(themeId);
  const id = (pack.config.id || DEFAULT_THEME_ID) as ThemeId;
  return {
    id,
    tokens: {
      ...(pack.config.tokens || {}),
      ...(customTokens || {}),
    },
    customCss: customCss || "",
  };
}

export function listThemePresets(): string[] {
  return listThemeIds();
}
