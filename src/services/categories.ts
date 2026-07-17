import { getTenant } from "@/lib/tenant";
import { parseKeywords } from "@/lib/seo";
import { slugify } from "@/lib/slug";
import type { BlogListItem } from "@/types/blog";
import type { Category } from "@/types/category";
import { getBlogs } from "./blogs";

/** A post's category = its first keyword, mirroring BlogCard behavior. */
function postCategoryName(post: BlogListItem): string | null {
  const keywords = parseKeywords(post.seo?.metaKeywords);
  return keywords[0] || null;
}

/**
 * Categories come from tenant config when provided; otherwise they are
 * derived from the first keyword of each published post (with counts).
 */
export async function getCategories(): Promise<Category[]> {
  const tenant = getTenant();
  const result = await getBlogs(1, 50);
  const posts = result.ok ? result.data : [];

  const counts = new Map<string, number>();
  for (const post of posts) {
    const name = postCategoryName(post);
    if (!name) continue;
    const slug = slugify(name);
    counts.set(slug, (counts.get(slug) || 0) + 1);
  }

  if (tenant.categories.length) {
    return tenant.categories.map((category) => ({
      ...category,
      count: counts.get(slugify(category.slug)) ?? counts.get(slugify(category.name)) ?? category.count,
    }));
  }

  const derived = new Map<string, Category>();
  for (const post of posts) {
    const name = postCategoryName(post);
    if (!name) continue;
    const slug = slugify(name);
    if (!slug) continue;
    if (!derived.has(slug)) {
      derived.set(slug, { slug, name, count: counts.get(slug) });
    }
  }

  return [...derived.values()].sort((a, b) => (b.count || 0) - (a.count || 0));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const normalized = slugify(slug);
  const categories = await getCategories();
  return categories.find((category) => category.slug === normalized) || null;
}

/** Posts whose first keyword matches the given category slug. */
export async function getBlogsByCategory(slug: string): Promise<BlogListItem[]> {
  const normalized = slugify(slug);
  const result = await getBlogs(1, 50);
  if (!result.ok) return [];

  return result.data.filter((post) => {
    const name = postCategoryName(post);
    return name ? slugify(name) === normalized : false;
  });
}
