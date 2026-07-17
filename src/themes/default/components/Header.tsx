import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { siteHref } from "@/lib/paths";
import { getTenant } from "@/lib/tenant";

/** Shared header — colors from theme.tokens (headerBg / headerFg / cta*). */
export default async function Header() {
  const { nav, brand, copy } = await getTenant();

  const uniqueNav = nav.filter(
    (item, index, list) =>
      list.findIndex((entry) => entry.href === item.href) === index
  );

  const resolvedNav = await Promise.all(
    uniqueNav.map(async (item) => ({
      ...item,
      // Migrate old "Stories" nav labels/hashes without requiring a DB re-save.
      label: item.label === "Stories" ? "Blogs" : item.label,
      href: item.href.startsWith("http")
        ? item.href
        : await siteHref(
            item.href.includes("#stories")
              ? item.href.replace("#stories", "#blogs")
              : item.href === "/#stories"
                ? "/#blogs"
                : item.href
          ),
    }))
  );

  const blogsHref = await siteHref("/#blogs");
  const ctaLabel = copy.heroCta?.trim() || "Browse blogs";

  return (
    <header className="theme-header sticky top-0 z-30 border-b backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-3.5 sm:px-8">
        <Logo />

        <nav
          className="ml-auto flex items-center gap-1 sm:gap-2"
          aria-label="Primary"
        >
          {resolvedNav.map((item) => (
            <Link
              key={`${item.label}:${item.href}`}
              href={item.href}
              className="theme-header__nav-link rounded-lg px-2.5 py-2 font-display text-xs font-medium transition-colors sm:px-3 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={blogsHref}
          className="theme-header__cta hidden shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 font-display text-xs font-semibold transition sm:inline-flex"
        >
          {ctaLabel.includes(brand.name) ? "Browse blogs" : ctaLabel}
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
