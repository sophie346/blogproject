import Link from "next/link";
import { siteHref } from "@/lib/paths";
import { getTenant } from "@/lib/tenant";
import { Logo } from "./Logo";

export async function SiteHeader() {
  const { nav, brand } = await getTenant();

  const uniqueNav = nav.filter(
    (item, index, list) =>
      list.findIndex((entry) => entry.href === item.href) === index
  );

  const resolvedNav = await Promise.all(
    uniqueNav.map(async (item) => ({
      ...item,
      href: await siteHref(item.href),
    }))
  );

  const storiesHref = await siteHref("/#stories");

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur-md">
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
              className="rounded-lg px-2.5 py-2 font-display text-xs font-medium text-fog-muted transition-colors hover:bg-white/5 hover:text-fog sm:px-3 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={storiesHref}
          className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-amber/45 bg-amber/15 px-3.5 py-2 font-display text-xs font-semibold text-amber-soft transition hover:border-amber hover:bg-amber/25 sm:inline-flex"
        >
          Read {brand.name}
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
