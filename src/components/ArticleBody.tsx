function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripDangerousHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+=(["']).*?\1/gi, "")
    .replace(/\son\w+=([^\s>]+)/gi, "");
}

/** Turn CMS HTML or plain text into safe article markup. */
export function toArticleHtml(content: string) {
  const trimmed = String(content ?? "").trim();
  if (!trimmed) return "";

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return stripDangerousHtml(trimmed);
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

type ArticleBodyProps = {
  html: string;
};

export function ArticleBody({ html }: ArticleBodyProps) {
  const markup = toArticleHtml(html);
  if (!markup) return null;

  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
