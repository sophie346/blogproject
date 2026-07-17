import { getApiConfig as getTenantApiConfig, getTenant } from "./tenant";

/**
 * Backwards-compatible brand config derived from the active tenant.
 * New code should read `getTenant()` directly; this exists so existing
 * imports of `siteConfig` keep working.
 */
export const siteConfig = (() => {
  const { brand } = getTenant();
  return {
    name: brand.name,
    alternateName: brand.alternateName || brand.name.toLowerCase(),
    tagline: brand.tagline,
    description: brand.description,
    locale: brand.locale,
    language: brand.language,
    author: brand.author,
  };
})();

export const getApiConfig = getTenantApiConfig;
export { getTenant };
