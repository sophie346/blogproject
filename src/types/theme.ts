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
  /**
   * Comma-separated Google Font family names to load
   * (e.g. "Roboto" or "Work Sans, Libre Baskerville").
   */
  googleFonts?: string;
  /** CSS font-family for UI / headings (overrides --font-display / --font-sans). */
  fontDisplay?: string;
  fontSans?: string;
  fontSerif?: string;
};

export type ThemeConfig = {
  id: ThemeId;
  tokens?: ThemeTokens;
  /**
   * Modern hero layout:
   * - `split` — brand + illustration (default)
   * - `centered` — marketing headline + product chips
   */
  heroLayout?: "split" | "centered" | "marketing";
  /** Site-level CSS overrides from ChannelAdmin (sanitized before inject). */
  customCss?: string;
};
