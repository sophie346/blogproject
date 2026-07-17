import type { CSSProperties } from "react";
import {
  fontStackFromFamily,
  parseGoogleFontFamilies,
} from "@/lib/fonts";
import type { ThemeTokens } from "@/types/theme";

const TOKEN_TO_VAR: Partial<Record<keyof ThemeTokens, string>> = {
  ink: "--ink",
  inkSoft: "--ink-soft",
  steel: "--steel",
  steelBright: "--steel-bright",
  amber: "--amber",
  amberSoft: "--amber-soft",
  fog: "--fog",
  fogMuted: "--fog-muted",
  line: "--line",
  glow: "--glow",
  headerBg: "--header-bg",
  headerFg: "--header-fg",
  headerMuted: "--header-muted",
  headerBorder: "--header-border",
  footerBg: "--footer-bg",
  footerFg: "--footer-fg",
  footerMuted: "--footer-muted",
  footerBorder: "--footer-border",
  ctaBg: "--cta-bg",
  ctaFg: "--cta-fg",
  fontDisplay: "--font-display",
  fontSans: "--font-sans",
  fontSerif: "--font-serif",
};

/**
 * Convert tenant theme tokens into inline CSS custom properties that can be
 * applied on <html> / a wrapper so clients rebrand without forking CSS.
 */
export function themeTokensToStyle(
  tokens: ThemeTokens | undefined
): CSSProperties {
  if (!tokens) return {};
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (!value || key === "googleFonts") continue;
    const cssVar = TOKEN_TO_VAR[key as keyof ThemeTokens];
    if (cssVar) style[cssVar] = value;
  }

  // If googleFonts is set but stacks are omitted, derive stacks from the
  // first family. Also override --font-syne: Tailwind's .font-display utility
  // compiles to font-family: var(--font-syne), so --font-display alone is ignored.
  const families = parseGoogleFontFamilies(tokens.googleFonts);
  if (families[0]) {
    const stack = fontStackFromFamily(families[0]);
    if (!style["--font-display"]) style["--font-display"] = stack;
    if (!style["--font-sans"]) style["--font-sans"] = stack;
    style["--font-syne"] = stack;
    if (families[1]) {
      const serif = fontStackFromFamily(families[1]);
      if (!style["--font-serif"]) style["--font-serif"] = serif;
      style["--font-source-serif"] = serif;
    }
  }

  return style as CSSProperties;
}
