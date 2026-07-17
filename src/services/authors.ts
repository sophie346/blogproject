import { getTenant } from "@/lib/tenant";
import { slugify } from "@/lib/slug";
import type { BlogListItem } from "@/types/blog";
import type { Author } from "@/types/category";
import { getBlogs } from "./blogs";

/** Known authors from tenant config. The first is the default post author. */
export async function getAuthors(): Promise<Author[]> {
  return (await getTenant()).authors;
}

export async function getDefaultAuthor(): Promise<Author> {
  const authors = await getAuthors();
  const tenant = await getTenant();
  return authors[0] || { slug: slugify(tenant.brand.author), name: tenant.brand.author };
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const normalized = slugify(slug);
  const authors = await getAuthors();
  return authors.find((author) => slugify(author.slug) === normalized) || null;
}

/**
 * Posts by author. The BFF has no per-post author yet, so every post is
 * attributed to the tenant's default author; other authors return none.
 */
export async function getBlogsByAuthor(slug: string): Promise<BlogListItem[]> {
  const normalized = slugify(slug);
  const defaultAuthor = await getDefaultAuthor();
  if (slugify(defaultAuthor.slug) !== normalized) return [];

  const result = await getBlogs(1, 50);
  return result.ok ? result.data : [];
}
