import {
  googleFontsStylesheetUrl,
  parseGoogleFontFamilies,
} from "@/lib/fonts";

type ThemeGoogleFontsProps = {
  googleFonts?: string;
};

/** Loads allowlisted Google Fonts from theme.tokens.googleFonts. */
export function ThemeGoogleFonts({ googleFonts }: ThemeGoogleFontsProps) {
  const families = parseGoogleFontFamilies(googleFonts);
  const href = googleFontsStylesheetUrl(families);
  if (!href) return null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link href={href} rel="stylesheet" />
    </>
  );
}
