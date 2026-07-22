"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type BlogSearchFormProps = {
  /** Current search query (from `?s=`). */
  initialQuery?: string;
  /**
   * Public blog home path including mount prefix
   * (e.g. `/blogtemp` or `/blog` or `` for root).
   */
  actionPath?: string;
  placeholder?: string;
  className?: string;
  /** Compact style for the sticky header. */
  compact?: boolean;
};

function buildHref(actionPath: string, q: string): string {
  const trimmed = String(actionPath || "").replace(/\/+$/, "");
  const base = trimmed || "";
  const pathPrefix = base.startsWith("/") || !base ? base : `/${base}`;
  const home = pathPrefix || "/";
  const query = q.trim();
  if (!query) {
    return home === "/" ? "/#blogs" : `${home}/#blogs`;
  }
  const qs = `s=${encodeURIComponent(query)}`;
  return home === "/" ? `/?${qs}#blogs` : `${home}/?${qs}#blogs`;
}

/** GET form → `/?s=query#blogs` (matches SEO SearchAction template). */
export function BlogSearchForm({
  initialQuery = "",
  actionPath = "/",
  placeholder = "Search blogs…",
  className = "",
  compact = false,
}: BlogSearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const inputId = compact ? "blog-search-header" : "blog-search";

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(buildHref(actionPath, query));
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={`blog-search ${compact ? "blog-search--compact" : ""} ${className}`.trim()}
    >
      <label className="sr-only" htmlFor={inputId}>
        Search blogs
      </label>
      <input
        id={inputId}
        type="search"
        name="s"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="blog-search__input"
        autoComplete="off"
      />
      <button type="submit" className="blog-search__btn" aria-label="Search">
        {compact ? (
          <span aria-hidden>⌕</span>
        ) : (
          "Search"
        )}
      </button>
    </form>
  );
}
