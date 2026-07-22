import Link from "next/link";

type PaginationProps = {
  page: number;
  totalcount: number;
  limit: number;
  /** Base path for links. Defaults to home ("/"). */
  basePath?: string;
  /** Optional hash appended to links (e.g. "#blogs"). */
  hash?: string;
  /** Extra query params preserved across pages (e.g. search `s`). */
  query?: Record<string, string | undefined>;
};

export function Pagination({
  page,
  totalcount,
  limit,
  basePath = "/",
  hash = "",
  query = {},
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalcount / limit));
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      const v = String(value || "").trim();
      if (v) params.set(key, v);
    }
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}${hash}`;
  };

  return (
    <nav className="pagination" aria-label="Blog pagination">
      {prev ? (
        <Link href={hrefFor(prev)} className="pagination__btn">
          <span aria-hidden>←</span>
          Newer
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">
          <span aria-hidden>←</span>
          Newer
        </span>
      )}

      <div className="pagination__indicator">
        <span className="pagination__page">{page}</span>
        <span className="pagination__sep">/</span>
        <span className="pagination__total">{totalPages}</span>
      </div>

      {next ? (
        <Link href={hrefFor(next)} className="pagination__btn">
          Older
          <span aria-hidden>→</span>
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">
          Older
          <span aria-hidden>→</span>
        </span>
      )}
    </nav>
  );
}
