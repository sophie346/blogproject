import Link from "next/link";
import type { Category } from "@/types/category";
import { siteHref } from "@/lib/paths";

type CategoriesProps = {
  categories: Category[];
  heading?: string;
  eyebrow?: string;
};

export async function Categories({
  categories,
  heading = "Browse by topic",
  eyebrow = "Categories",
}: CategoriesProps) {
  if (!categories.length) return null;

  const links = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      href: await siteHref(`/category/${category.slug}`),
    }))
  );

  return (
    <section
      id="categories"
      className="categories-section scroll-mt-8 px-5 py-16 sm:px-8"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-steel-bright">
          {eyebrow}
        </p>
        <h2
          id="categories-heading"
          className="mt-3 mb-8 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl"
        >
          {heading}
        </h2>
        <ul className="flex flex-wrap gap-3">
          {links.map((category) => (
            <li key={category.slug}>
              <Link href={category.href} className="category-chip group">
                <span>{category.name}</span>
                {typeof category.count === "number" ? (
                  <span className="text-xs text-fog-muted">{category.count}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
