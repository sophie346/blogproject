import { getTenant } from "@/lib/tenant";
import { slugify } from "@/lib/slug";
import type { BlogListItem } from "@/types/blog";
import type { Category } from "@/types/category";
import { getBlogs } from "./blogs";

function postCategories(post: BlogListItem): { slug: string; name: string }[] {
  if (Array.isArray(post.categories) && post.categories.length) {
    return post.categories;
  }
  return [];
}

/**
 * Prefer site settings vocabulary; otherwise derive from post.categories
 * (with counts from published posts).
 */
export async function getCategories(): Promise<Category[]> {
  const tenant = await getTenant();
  const result = await getBlogs(1, 50);
  const posts = result.ok ? result.data : [];

  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const cat of postCategories(post)) {
      counts.set(cat.slug, (counts.get(cat.slug) || 0) + 1);
    }
  }

  if (tenant.categories.length) {
    return tenant.categories.map((category) => ({
      ...category,
      count:
        counts.get(slugify(category.slug)) ??
        counts.get(slugify(category.name)) ??
        category.count,
    }));
  }

  const derived = new Map<string, Category>();
  for (const post of posts) {
    for (const cat of postCategories(post)) {
      if (!cat.slug) continue;
      if (!derived.has(cat.slug)) {
        derived.set(cat.slug, {
          slug: cat.slug,
          name: cat.name,
          count: counts.get(cat.slug),
        });
      }
    }
  }

  return [...derived.values()].sort((a, b) => (b.count || 0) - (a.count || 0));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const normalized = slugify(slug);
  const categories = await getCategories();
  return categories.find((category) => category.slug === normalized) || null;
}

export async function getBlogsByCategory(slug: string): Promise<BlogListItem[]> {
  const normalized = slugify(slug);
  const result = await getBlogs(1, 50, { category: normalized });
  if (!result.ok) return [];
  return result.data;
}
