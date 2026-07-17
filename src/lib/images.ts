/** Returns a usable absolute http(s) image URL, or null if invalid. */
export function getValidImageUrl(value: string | null | undefined): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Prefer featuredImage from BFF list/detail, then Open Graph image.
 * Matches `serializeBlogListItem` / `pickSeoSummary` fields.
 */
export function resolvePostImage(post: {
  featuredImage?: string | null;
  seo?: {
    openGraphImageUrl?: string | null;
  } | null;
}): string | null {
  return (
    getValidImageUrl(post.featuredImage) ||
    getValidImageUrl(post.seo?.openGraphImageUrl) ||
    null
  );
}
