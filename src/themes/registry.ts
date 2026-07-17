import type { ThemeId, ThemePackage } from "@/themes/types";
import defaultTheme from "@/themes/default";
import modernTheme from "@/themes/modern";
import luxuryTheme from "@/themes/luxury";

/**
 * Registered theme packages.
 * Add a new theme: create `src/themes/<id>/`, export ThemePackage, register here + admin THEME_OPTIONS.
 */
export const THEME_PACKAGES: Record<ThemeId, ThemePackage> = {
  default: defaultTheme,
  modern: modernTheme,
  luxury: luxuryTheme,
};

export const DEFAULT_THEME_ID: ThemeId = "default";

export function listThemeIds(): ThemeId[] {
  return Object.keys(THEME_PACKAGES) as ThemeId[];
}

export function getThemePackage(themeId: string | undefined): ThemePackage {
  const key = (themeId || DEFAULT_THEME_ID).trim().toLowerCase() as ThemeId;
  return THEME_PACKAGES[key] || THEME_PACKAGES[DEFAULT_THEME_ID];
}
