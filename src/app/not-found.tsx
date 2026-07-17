import Link from "next/link";
import { getTenant } from "@/lib/tenant";

export default function NotFound() {
  const { copy } = getTenant();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-5 py-24 sm:px-8">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-steel-bright">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-fog sm:text-5xl">
        {copy.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-lg text-lg leading-relaxed text-fog-muted">
        {copy.notFoundMessage}
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex border border-amber/50 bg-amber/10 px-5 py-3 font-display text-sm font-medium text-amber-soft transition hover:border-amber hover:bg-amber/20"
      >
        {copy.notFoundCta}
      </Link>
    </div>
  );
}
