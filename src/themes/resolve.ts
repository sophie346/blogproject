import {
  DEFAULT_THEME_ID,
  getThemePackage,
  THEME_PACKAGES,
} from "@/themes/registry";
import type { ThemeComponents, ThemeId, ThemeSlot } from "@/themes/types";

/**
 * WordPress-style child theme resolution:
 * use the active theme’s component if present, otherwise fall back to default.
 */
export function resolveThemeComponent<S extends ThemeSlot>(
  themeId: string | undefined,
  slot: S
): ThemeComponents[S] {
  const pack = getThemePackage(themeId);
  const fromTheme = pack.components[slot];
  if (fromTheme) return fromTheme as ThemeComponents[S];

  const fallback = THEME_PACKAGES[DEFAULT_THEME_ID].components[slot];
  if (!fallback) {
    throw new Error(
      `Theme slot "${slot}" is missing from the default theme package`
    );
  }
  return fallback as ThemeComponents[S];
}

/** Resolved full component map for a theme id (with defaults filled in). */
export function resolveThemeComponents(
  themeId: string | undefined
): ThemeComponents {
  const slots: ThemeSlot[] = ["Header", "Footer", "Hero", "BlogCard"];
  const resolved = {} as ThemeComponents;
  for (const slot of slots) {
    resolved[slot] = resolveThemeComponent(themeId, slot) as never;
  }
  return resolved;
}

export function normalizeThemeId(themeId: string | undefined): ThemeId {
  const key = (themeId || DEFAULT_THEME_ID).trim().toLowerCase();
  if (key === "modern" || key === "luxury" || key === "default") return key;
  return DEFAULT_THEME_ID;
}
