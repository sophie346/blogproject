import { getApiConfig as getTenantApiConfig, getTenant } from "./tenant";

/** Brand config derived from the active (Host-resolved) tenant. */
export async function getSiteConfig() {
  const { brand, siteUrl } = await getTenant();
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

export const getApiConfig = getTenantApiConfig;
export { getTenant };
