import type { MetadataRoute } from "next";
import { getAuthors } from "@/services/authors";
import { getBlogs } from "@/services/blogs";
import { getCategories } from "@/services/categories";
import { getBlogSitemapFromDb } from "@/services/sitemap";
import { getTags } from "@/services/tags";
import { absoluteUrl, toIsoDate } from "@/lib/seo";

function toChangeFrequency(
  value: string | undefined
): MetadataRoute.Sitemap[number]["changeFrequency"] {
  const allowed = [
    "always",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "never",
  ] as const;
  if (value && (allowed as readonly string[]).includes(value)) {
    return value as (typeof allowed)[number];
  }
  return "weekly";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fromDb = await getBlogSitemapFromDb();

  if (fromDb.length > 0) {
    const entries: MetadataRoute.Sitemap = [];
    for (const row of fromDb) {
      const url = row.loc || (row.path ? await absoluteUrl(row.path) : "");
      if (!url) continue;
      entries.push({
        url,
        lastModified: toIsoDate(row.lastmod)
          ? new Date(row.lastmod as string)
          : new Date(),
        changeFrequency: toChangeFrequency(row.changefreq),
        priority:
          typeof row.priority === "number" && Number.isFinite(row.priority)
            ? row.priority
            : 0.5,
      });
    }
    if (entries.length) return entries;
  }

  // Fallback until admin rebuild / first publish registers rows in Mongo
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

  try {
    const categories = await getCategories();
    for (const category of categories) {
      if (!category.slug) continue;
      entries.push({
        url: await absoluteUrl(`/category/${category.slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch {
    /* optional */
  }

  try {
    const tags = await getTags();
    for (const tag of tags) {
      if (!tag.slug) continue;
      entries.push({
        url: await absoluteUrl(`/tag/${tag.slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  } catch {
    /* optional */
  }

  try {
    const authors = await getAuthors();
    for (const author of authors) {
      if (!author.slug) continue;
      entries.push({
        url: await absoluteUrl(`/author/${author.slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }
  } catch {
    /* optional */
  }

  return entries;
}
