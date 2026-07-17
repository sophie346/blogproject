/**
 * Parse and sanitize googleFonts theme token (comma-separated family names).
 * Only allow simple family names to keep the Google Fonts <link> safe.
 */
export function parseGoogleFontFamilies(
  raw: string | undefined | null
): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of String(raw).split(",")) {
    const name = part.trim().replace(/\s+/g, " ");
    if (!/^[A-Za-z][A-Za-z0-9 ]{0,39}$/.test(name)) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
    if (out.length >= 4) break;
  }
  return out;
}

/** Build a CSS font-family stack from a Google family name. */
export function fontStackFromFamily(family: string): string {
  const safe = family.trim();
  if (!safe) return "";
  // Quote multi-word families; leave single tokens bare (Roboto, Inter, …).
  const named = /\s/.test(safe) ? `"${safe}"` : safe;
  return `${named}, ui-sans-serif, system-ui, sans-serif`;
}

/** Google Fonts CSS2 URL for the given families (weights used by the blog UI). */
export function googleFontsStylesheetUrl(families: string[]): string | null {
  if (!families.length) return null;
  const params = families
    .map(
      (name) =>
        `family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@400;500;600;700;800`
    )
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
