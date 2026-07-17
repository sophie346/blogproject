import { getTenant } from "@/lib/tenant";
import { slugify } from "@/lib/slug";
import type { BlogListItem } from "@/types/blog";
import type { Tag } from "@/types/category";
import { getBlogs } from "./blogs";

function postTags(post: BlogListItem): { slug: string; name: string }[] {
  if (Array.isArray(post.tags) && post.tags.length) {
    return post.tags;
  }
  return [];
}

/** Tags from posts (+ optional tenant vocabulary), with counts. */
export async function getTags(): Promise<Tag[]> {
  const tenant = await getTenant();
  const result = await getBlogs(1, 50);
  if (!result.ok) return [];

  const bySlug = new Map<string, Tag>();
  for (const post of result.data) {
    for (const tag of postTags(post)) {
      const slug = slugify(tag.slug || tag.name);
      if (!slug) continue;
      const existing = bySlug.get(slug);
      if (existing) {
        existing.count = (existing.count || 0) + 1;
      } else {
        bySlug.set(slug, { slug, name: tag.name, count: 1 });
      }
    }
  }

  const tenantTags = Array.isArray(tenant.tags) ? tenant.tags : [];
  for (const tag of tenantTags) {
    const slug = slugify(tag.slug || tag.name);
    if (!slug || bySlug.has(slug)) continue;
    bySlug.set(slug, { slug, name: tag.name, count: tag.count || 0 });
  }

  return [...bySlug.values()].sort((a, b) => (b.count || 0) - (a.count || 0));
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const normalized = slugify(slug);
  const tags = await getTags();
  return tags.find((tag) => tag.slug === normalized) || null;
}

export async function getBlogsByTag(slug: string): Promise<BlogListItem[]> {
  const normalized = slugify(slug);
  const result = await getBlogs(1, 50, { tag: normalized });
  if (!result.ok) return [];
  return result.data;
}
