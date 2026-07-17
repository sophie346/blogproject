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
  /** Header / footer chrome — same layout, different brand colors via DB. */
  headerBg?: string;
  headerFg?: string;
  headerMuted?: string;
  headerBorder?: string;
  footerBg?: string;
  footerFg?: string;
  footerMuted?: string;
  footerBorder?: string;
  ctaBg?: string;
  ctaFg?: string;
};

export type ThemeConfig = {
  id: ThemeId;
  tokens?: ThemeTokens;
  /** Site-level CSS overrides from ChannelAdmin (sanitized before inject). */
  customCss?: string;
};
