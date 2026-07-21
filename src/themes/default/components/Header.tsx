import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { siteHref } from "@/lib/paths";
import { getTenant } from "@/lib/tenant";

function isDemoNavItem(item: { label: string; href: string }) {
  const label = item.label.toLowerCase();
  const href = item.href.toLowerCase();
  return (
    label.includes("demo") ||
    href.includes("request-demo") ||
    href.includes("/demo")
  );
}

async function resolveNavHref(href: string) {
  if (href.startsWith("http")) return href;
  return siteHref(
    href.includes("#stories")
      ? href.replace("#stories", "#blogs")
      : href === "/#stories"
        ? "/#blogs"
        : href
  );
}

/** Shared header — colors from theme.tokens (headerBg / headerFg / cta*). */
export default async function Header() {
  const { nav, brand, copy } = await getTenant();

  const uniqueNav = nav.filter(
    (item, index, list) =>
      list.findIndex((entry) => entry.href === item.href) === index
  );

  // Promote "Book a Demo" (etc.) to the CTA button — matches marketing chrome.
  const demoItem = uniqueNav.find(isDemoNavItem) || null;
  const linkNav = demoItem
    ? uniqueNav.filter((item) => item !== demoItem)
    : uniqueNav;

  const resolvedNav = await Promise.all(
    linkNav.map(async (item) => ({
      ...item,
      // Migrate old "Stories" nav labels/hashes without requiring a DB re-save.
      label: item.label === "Stories" ? "Blogs" : item.label,
      href: await resolveNavHref(item.href),
    }))
  );

  const blogsHref = await siteHref("/#blogs");
  const ctaHref = demoItem
    ? await resolveNavHref(demoItem.href)
    : blogsHref;
  const rawCta = demoItem?.label || copy.heroCta?.trim() || "Browse blogs";
  const ctaLabel = rawCta.includes(brand.name) ? "Browse blogs" : rawCta;
  const ctaIsExternal = /^https?:\/\//i.test(ctaHref);

  return (
    <header className="theme-header sticky top-0 z-30 border-b backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-3.5 sm:px-8">
        <Logo />

        <nav
          className="ml-auto flex items-center gap-1 sm:gap-2"
          aria-label="Primary"
        >
          {resolvedNav.map((item) =>
            item.href.startsWith("http") ? (
              <a
                key={`${item.label}:${item.href}`}
                href={item.href}
                className="theme-header__nav-link rounded-lg px-2.5 py-2 font-display text-xs font-medium transition-colors sm:px-3 sm:text-sm"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={`${item.label}:${item.href}`}
                href={item.href}
                className="theme-header__nav-link rounded-lg px-2.5 py-2 font-display text-xs font-medium transition-colors sm:px-3 sm:text-sm"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <a
          href={ctaHref}
          className="theme-header__cta hidden shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 font-display text-xs font-semibold transition sm:inline-flex"
          {...(ctaIsExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
