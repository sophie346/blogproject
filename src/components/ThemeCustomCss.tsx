import { sanitizeCustomCss } from "@/lib/sanitize-html";

type ThemeCustomCssProps = {
  css?: string;
};

/** Injects sanitized site custom CSS after theme package styles. */
export function ThemeCustomCss({ css }: ThemeCustomCssProps) {
  const safe = sanitizeCustomCss(css);
  if (!safe.trim()) return null;

  return (
    <style
      id="blog-custom-css"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
