import Link from "next/link";
import { getTenant } from "@/lib/tenant";

export default async function NotFound() {
  const { copy } = await getTenant();

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-4 px-5 py-24 sm:px-8">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-amber">
        404
      </p>
      <h1 className="font-display text-3xl font-bold tracking-tight text-fog sm:text-4xl">
        {copy.notFoundTitle}
      </h1>
      <p className="max-w-xl text-base leading-relaxed text-fog-muted">
        {copy.notFoundMessage}
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-xl border border-amber/45 bg-amber/15 px-4 py-2.5 font-display text-sm font-semibold text-amber-soft transition hover:border-amber hover:bg-amber/25"
      >
        {copy.notFoundCta}
        <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
