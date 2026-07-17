/**
 * Blog post HTML sanitizer.
 * Theme CSS owns presentation — strip authoring-time style/class noise from the editor.
 */

const MAX_CONTENT_LENGTH = 2_000_000;

export function stripInlinePresentation(html: string): string {
  let out = String(html ?? "");
  if (!out) return "";
  if (out.length > MAX_CONTENT_LENGTH) {
    out = out.slice(0, MAX_CONTENT_LENGTH);
  }

  return (
    out
      // Drop embedded style/script blocks
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
      // Inline event handlers
      .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
      .replace(/\son\w+\s*=\s*([^\s>]+)/gi, "")
      // Presentation attrs — theme CSS replaces these
      .replace(/\sstyle\s*=\s*(["'])[\s\S]*?\1/gi, "")
      .replace(/\sstyle\s*=\s*([^\s>]+)/gi, "")
      .replace(/\sclass\s*=\s*(["'])[\s\S]*?\1/gi, "")
      .replace(/\sclass\s*=\s*([^\s>]+)/gi, "")
      .replace(/\sclassName\s*=\s*(["'])[\s\S]*?\1/gi, "")
      // Font tags from old WordPress paste
      .replace(/<\/?font\b[^>]*>/gi, "")
  );
}

const MAX_CUSTOM_CSS = 80_000;

/**
 * Sanitize site-level custom CSS before injecting into <style>.
 * Keeps CSS only — strips HTML/JS and dangerous constructs.
 */
export function sanitizeCustomCss(css: string | null | undefined): string {
  let out = String(css ?? "");
  if (!out.trim()) return "";
  if (out.length > MAX_CUSTOM_CSS) out = out.slice(0, MAX_CUSTOM_CSS);

  return (
    out
      .replace(/<\/style/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/@import\b[^;]*;?/gi, "")
      .replace(/expression\s*\(/gi, "")
      .replace(/javascript\s*:/gi, "")
      .replace(/-moz-binding\s*:/gi, "")
      .replace(/behavior\s*:/gi, "")
  );
}
