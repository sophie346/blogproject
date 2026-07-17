import { slugify } from "@/lib/slug";
import { parseKeywords } from "@/lib/seo";
import type { BlogListItem } from "@/types/blog";
import type { Tag } from "@/types/category";
import { getBlogs } from "./blogs";

/** All keyword-derived tags across published posts, with counts. */
export async function getTags(): Promise<Tag[]> {
  const result = await getBlogs(1, 50);
  if (!result.ok) return [];

  const bySlug = new Map<string, Tag>();
  for (const post of result.data) {
    for (const keyword of parseKeywords(post.seo?.metaKeywords)) {
      const slug = slugify(keyword);
      if (!slug) continue;
      const existing = bySlug.get(slug);
      if (existing) {
        existing.count = (existing.count || 0) + 1;
      } else {
        bySlug.set(slug, { slug, name: keyword, count: 1 });
      }
    }
  }

  return [...bySlug.values()].sort((a, b) => (b.count || 0) - (a.count || 0));
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const normalized = slugify(slug);
  const tags = await getTags();
  return tags.find((tag) => tag.slug === normalized) || null;
}

/** Posts whose keywords include the given tag slug. */
export async function getBlogsByTag(slug: string): Promise<BlogListItem[]> {
  const normalized = slugify(slug);
  const result = await getBlogs(1, 50);
  if (!result.ok) return [];

  return result.data.filter((post) =>
    parseKeywords(post.seo?.metaKeywords).some(
      (keyword) => slugify(keyword) === normalized
    )
  );
}
