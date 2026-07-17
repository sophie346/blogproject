import { apiGet, getAxiosErrorMessage } from "@/lib/http";
import { getApiConfig } from "@/lib/tenant";

export type BlogSitemapEntry = {
  entity: string;
  slug: string;
  path: string;
  loc: string;
  lastmod: string | null;
  changefreq: string;
  priority: number;
};

async function buildBffHeaders(): Promise<Record<string, string>> {
  const { clientName, label, authToken } = await getApiConfig();
  const headers: Record<string, string> = {
    Accept: "application/json",
    clientname: clientName,
  };
  if (label) headers.label = label;
  if (authToken) {
    headers.Authorization = authToken.startsWith("Bearer ")
      ? authToken
      : `Bearer ${authToken}`;
  }
  return headers;
}

/**
 * Load sitemap rows registered in Mongo (B2BWebsiteBlogSitemap) via BFF.
 * Empty array when none registered yet — caller may fall back to live post scan.
 */
export async function getBlogSitemapFromDb(): Promise<BlogSitemapEntry[]> {
  const { label, clientName, apiBase } = await getApiConfig();
  if (!apiBase || !clientName || !label) return [];

  try {
    const res = await apiGet<{
      error?: boolean;
      data?: BlogSitemapEntry[];
    }>("/prod/blog-sitemap", {
      params: { label },
      headers: await buildBffHeaders(),
    });
    if (res.data?.error) return [];
    const rows = Array.isArray(res.data?.data) ? res.data.data : [];
    return rows.filter((row) => row?.loc || row?.path);
  } catch (err) {
    console.error(
      "[sitemap] blog-sitemap fetch failed:",
      await getAxiosErrorMessage(err, "failed")
    );
    return [];
  }
}
