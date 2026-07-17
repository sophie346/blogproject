import Image from "next/image";
import Link from "next/link";
import { siteHref } from "@/lib/paths";
import { getTenant } from "@/lib/tenant";

type LogoProps = {
  href?: string;
  className?: string;
};

export async function Logo({ href, className }: LogoProps) {
  const { brand } = await getTenant();
  const initial = (brand.name || "N").charAt(0).toUpperCase();
  const homeHref = href ?? (await siteHref("/"));

  return (
    <Link
      href={homeHref}
      className={`site-logo inline-flex shrink-0 items-center gap-2.5 ${className || ""}`.trim()}
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={200}
          height={48}
          className="site-logo__image h-10 w-auto max-w-[220px] object-contain"
          priority
        />
      ) : (
        <>
          <span
            className="site-logo__mark inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber font-display text-sm font-extrabold tracking-tight text-white"
            aria-hidden
          >
            {initial}
          </span>
          <span className="site-logo__text font-display text-lg font-bold tracking-tight text-fog transition-colors hover:text-amber-soft">
            {brand.name}
          </span>
        </>
      )}
    </Link>
  );
}
