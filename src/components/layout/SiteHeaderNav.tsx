"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

export type HeaderNavItem = {
  label: string;
  href: string;
};

type SiteHeaderNavProps = {
  items: HeaderNavItem[];
  ctaLabel: string;
  ctaHref: string;
  ctaIsExternal?: boolean;
};

function NavAnchor({
  item,
  className,
  onNavigate,
}: {
  item: HeaderNavItem;
  className: string;
  onNavigate?: () => void;
}) {
  if (item.href.startsWith("http")) {
    return (
      <a href={item.href} className={className} onClick={onNavigate}>
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

/** Desktop nav + mobile hamburger drawer for the shared theme header. */
export function SiteHeaderNav({
  items,
  ctaLabel,
  ctaHref,
  ctaIsExternal = false,
}: SiteHeaderNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass =
    "theme-header__nav-link rounded-lg px-2.5 py-2 font-display text-xs font-medium transition-colors sm:px-3 sm:text-sm";
  const mobileLinkClass =
    "theme-header__nav-link block rounded-lg px-3 py-3 font-display text-base font-medium";

  return (
    <>
      <nav
        className="ml-auto hidden items-center gap-1 md:flex lg:gap-2"
        aria-label="Primary"
      >
        {items.map((item) => (
          <NavAnchor
            key={`${item.label}:${item.href}`}
            item={item}
            className={linkClass}
          />
        ))}
      </nav>

      <a
        href={ctaHref}
        className="theme-header__cta ml-auto hidden shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 font-display text-xs font-semibold transition md:inline-flex"
        {...(ctaIsExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {ctaLabel}
        <span aria-hidden>→</span>
      </a>

      <button
        type="button"
        className="theme-header__menu-btn ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--header-border)] text-[color:var(--header-fg)] md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden className="relative block h-3.5 w-4">
          <span
            className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition ${
              open ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 h-0.5 w-4 bg-current transition ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-3 h-0.5 w-4 bg-current transition ${
              open ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className="theme-header__mobile absolute inset-x-0 top-full z-40 border-b border-[color:var(--header-border)] bg-[color:var(--header-bg)] px-5 py-4 shadow-lg md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile primary">
            {items.map((item) => (
              <NavAnchor
                key={`mobile:${item.label}:${item.href}`}
                item={item}
                className={mobileLinkClass}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
          <a
            href={ctaHref}
            className="theme-header__cta mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3.5 py-3 font-display text-sm font-semibold transition"
            onClick={() => setOpen(false)}
            {...(ctaIsExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </a>
        </div>
      ) : null}
    </>
  );
}
