import type { Metadata } from "next";

/** Storefront origin (scheme + host), stripping blog mount paths like /blog or /blogstemp. */
export function getStorefrontOrigin(siteUrl: string): string {
  try {
    return new URL(siteUrl).origin;
  } catch {
    return "";
  }
}

function abs(origin: string, path: string) {
  if (!origin) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Favicon candidates from the main storefront site.
 * Browsers try these in order; include common storefront patterns.
 */
export function storefrontFaviconIcons(
  siteUrl: string,
  brandFavicon?: string | null
): NonNullable<Metadata["icons"]> {
  const origin = getStorefrontOrigin(siteUrl);
  const explicit = String(brandFavicon || "").trim();
  if (explicit) {
    return {
      icon: [{ url: explicit }],
      shortcut: explicit,
    };
  }

  if (!origin) {
    return { icon: "/favicon.ico" };
  }

  return {
    icon: [
      { url: abs(origin, "/favicon.ico") },
      { url: abs(origin, "/favicon.jpeg"), type: "image/jpeg" },
      { url: abs(origin, "/favicon.png"), type: "image/png" },
      { url: abs(origin, "/favicon.svg"), type: "image/svg+xml" },
      { url: abs(origin, "/icon.png"), type: "image/png" },
    ],
    shortcut: abs(origin, "/favicon.ico"),
    apple: abs(origin, "/apple-touch-icon.png"),
  };
}
