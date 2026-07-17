import { stripInlinePresentation } from "@/lib/sanitize-html";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripDangerousHtml(html: string) {
  return stripInlinePresentation(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
}

function imagePathKey(url: string): string {
  try {
    const path = new URL(url).pathname;
    const base = path.split("/").pop() || path;
    // Ignore size/hash suffixes when matching WP/GCS variants of the same asset.
    return base
      .toLowerCase()
      .replace(/[-_][0-9a-f]{8,}\b/g, "")
      .replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, "");
  } catch {
    return url.trim().toLowerCase();
  }
}

/**
 * Drop a leading <figure>/<img> that duplicates the post hero image so the
 * body does not stack the same photo twice (common WP paste).
 */
export function stripLeadingDuplicateImage(html: string, featuredUrl?: string | null) {
  const featured = String(featuredUrl || "").trim();
  if (!featured || !html) return html;

  const featuredKey = imagePathKey(featured);
  if (!featuredKey) return html;

  return html.replace(
    /^\s*(?:<figure\b[^>]*>\s*)?<img\b[^>]*>\s*(?:<\/figure>\s*)?/i,
    (match) => {
      const srcMatch = match.match(/\bsrc\s*=\s*(["'])(.*?)\1/i);
      const src = srcMatch?.[2] || "";
      if (!src) return match;
      return imagePathKey(src) === featuredKey ? "" : match;
    }
  );
}

/** Turn CMS HTML or plain text into safe article markup (no inline style/class). */
export function toArticleHtml(content: string, featuredUrl?: string | null) {
  const trimmed = String(content ?? "").trim();
  if (!trimmed) return "";

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return stripDangerousHtml(stripLeadingDuplicateImage(trimmed, featuredUrl));
  }

  return trimmed
    .split(/\n\s*\n/)
    .map((block) => {
      const body = escapeHtml(block.trim()).replace(/\n/g, "<br />");
      return body ? `<p>${body}</p>` : "";
    })
    .filter(Boolean)
    .join("");
}

/** WP auto-excerpts often end with […] — hide those on the single post page. */
export function isUsefulPostExcerpt(excerpt: string | null | undefined, content?: string | null) {
  const text = String(excerpt ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return false;
  if (/(?:\[\u2026\]|\[\.\.\.\]|\u2026|\.\.\.)$/.test(text)) return false;

  const bodyText = String(content ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (bodyText && bodyText.startsWith(text.toLowerCase().slice(0, 80))) {
    return false;
  }
  return true;
}

type ArticleBodyProps = {
  html: string;
  /** When set, a leading body image matching this URL is removed. */
  featuredUrl?: string | null;
};

export function ArticleBody({ html, featuredUrl }: ArticleBodyProps) {
  const markup = toArticleHtml(html, featuredUrl);
  if (!markup) return null;

  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
