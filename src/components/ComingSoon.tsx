/** Shown when the request Host is not in SITES_BY_HOST. */
export function ComingSoon() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#0b0d10] px-6 py-24 text-center">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-amber-400/90">
        Blog
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
        Coming soon
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
        This site isn’t available yet. Check back later.
      </p>
    </main>
  );
}
