import Link from "next/link";
import type { Category } from "@/types/category";
import { siteHref } from "@/lib/paths";

type CategorySidebarProps = {
  categories: Category[];
  heading?: string;
  eyebrow?: string;
};

/** Compact category list for the blogs sidebar. */
export async function CategorySidebar({
  categories,
  heading = "Browse by topic",
  eyebrow = "Categories",
}: CategorySidebarProps) {
  if (!categories.length) return null;

  const links = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      href: await siteHref(`/category/${category.slug}`),
    }))
  );

  return (
    <aside
      id="categories"
      className="category-sidebar scroll-mt-8 rounded-2xl border border-line bg-ink-soft p-4 sm:p-5"
      aria-labelledby="categories-heading"
    >
      <p className="font-display text-[0.65rem] uppercase tracking-[0.18em] text-steel-bright">
        {eyebrow}
      </p>
      <h2
        id="categories-heading"
        className="mt-1.5 font-display text-lg font-semibold tracking-tight text-fog"
      >
        {heading}
      </h2>
      <ul className="mt-4 flex flex-col gap-2">
        {links.map((category) => (
          <li key={category.slug}>
            <Link
              href={category.href}
              className="category-chip group flex w-full items-center justify-between gap-2 rounded-xl border border-line bg-ink px-3 py-2.5 no-underline transition hover:border-amber"
            >
              <span className="font-display text-sm font-medium text-fog group-hover:text-amber">
                {category.name}
              </span>
              {typeof category.count === "number" ? (
                <span className="font-display text-xs text-fog-muted">
                  {category.count}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
