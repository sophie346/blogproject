import type { MetadataRoute } from "next";
import { getBlogs } from "@/services/blogs";
import { absoluteUrl, toIsoDate } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: await absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: await absoluteUrl("/feed.xml"),
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.3,
    },
  ];

  const limit = 50;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 40) {
    const result = await getBlogs(page, limit);
    if (!result.ok) break;

    totalPages = Math.max(1, Math.ceil(result.totalcount / limit));

    for (const post of result.data) {
      if (!post.slug) continue;
      entries.push({
        url: await absoluteUrl(`/blog/${post.slug}`),
        lastModified: toIsoDate(post.updatedDate || post.publishedDate)
          ? new Date(post.updatedDate || post.publishedDate || "")
          : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    if (result.data.length === 0) break;
    page += 1;
  }

  return entries;
}
