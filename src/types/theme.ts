export type ThemeId = "default" | "modern" | "luxury";

/** CSS custom-property overrides applied on <html> at runtime.
 * Keys map to the design tokens declared in styles/variables.css. */
export type ThemeTokens = {
  ink?: string;
  inkSoft?: string;
  steel?: string;
  steelBright?: string;
  amber?: string;
  amberSoft?: string;
  fog?: string;
  fogMuted?: string;
  line?: string;
  glow?: string;
};

export type ThemeConfig = {
  id: ThemeId;
  tokens?: ThemeTokens;
};
