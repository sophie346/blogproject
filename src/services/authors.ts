import { getTenant } from "@/lib/tenant";
import { slugify } from "@/lib/slug";
import type { BlogListItem } from "@/types/blog";
import type { Author } from "@/types/category";
import { getBlogs } from "./blogs";

/** Known authors from tenant config. The first is the default post author. */
export function getAuthors(): Author[] {
  return getTenant().authors;
}

export function getDefaultAuthor(): Author {
  const authors = getAuthors();
  const tenant = getTenant();
  return authors[0] || { slug: slugify(tenant.brand.author), name: tenant.brand.author };
}

export function getAuthorBySlug(slug: string): Author | null {
  const normalized = slugify(slug);
  return (
    getAuthors().find((author) => slugify(author.slug) === normalized) || null
  );
}

/**
 * Posts by author. The BFF has no per-post author yet, so every post is
 * attributed to the tenant's default author; other authors return none.
 */
export async function getBlogsByAuthor(slug: string): Promise<BlogListItem[]> {
  const normalized = slugify(slug);
  const defaultAuthor = getDefaultAuthor();
  if (slugify(defaultAuthor.slug) !== normalized) return [];

  const result = await getBlogs(1, 50);
  return result.ok ? result.data : [];
}
