import { getTenant, getTenantOrNull } from "./tenant";

/** Brand config derived from the active (Host-resolved) tenant. */
export async function getSiteConfig() {
  const tenant = await getTenant();
  const { brand, siteUrl } = tenant;
  return {
    name: brand.name,
    alternateName: brand.alternateName || brand.name.toLowerCase(),
    tagline: brand.tagline,
    description: brand.description,
    locale: brand.locale,
    language: brand.language,
    author: brand.author,
    siteUrl,
  };
}

/** Prefer `@/lib/tenant` for getApiConfig to avoid circular re-exports. */
export { getApiConfig, getTenant, getTenantOrNull } from "./tenant";
