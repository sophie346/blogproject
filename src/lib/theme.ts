import type { CSSProperties } from "react";
import type { ThemeTokens } from "@/types/theme";

const TOKEN_TO_VAR: Record<keyof ThemeTokens, string> = {
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
    if (!value) continue;
    const cssVar = TOKEN_TO_VAR[key as keyof ThemeTokens];
    if (cssVar) style[cssVar] = value;
  }
  return style as CSSProperties;
}
