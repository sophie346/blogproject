import { getTenant } from "@/lib/tenant";
import type { HeroProps } from "@/themes/types";
import { HeroIllustration } from "./HeroIllustration";

const PRODUCT_FAMILY = [
  { label: "1CA", href: "https://onechanneladmin.info/" },
  { label: "OneProductHub", href: "https://oneproducthub.com/" },
  { label: "OneFulfillCenter", href: "https://onefulfillcenter.com/" },
  { label: "OneDirectBuy", href: "https://onedirectbuy.com/" },
];

/** Centered marketing hero — distinct from the shared split+illustration layout. */
function CenteredHero({
  eyebrow,
  title,
  subtitle,
  cta,
  stat,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-[22rem] w-[22rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--amber) 28%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-[20rem] w-[20rem] rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--amber-soft) 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
        <p className="fade-up font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-steel-bright">
          {eyebrow}
        </p>

        <h1 className="fade-up fade-up-delay-1 mt-5 max-w-3xl font-display text-[clamp(2.1rem,5.5vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-fog">
          {title}
        </h1>

        <p className="fade-up fade-up-delay-2 mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-fog-muted sm:text-lg">
          {subtitle}
        </p>

        <div className="fade-up fade-up-delay-2 mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#blogs"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 font-display text-sm font-semibold text-white no-underline shadow-[0_12px_40px_color-mix(in_srgb,var(--amber)_35%,transparent)] transition hover:brightness-110"
          >
            {cta}
            <span aria-hidden>→</span>
          </a>
          {stat ? (
            <span className="rounded-full border border-line bg-ink-soft px-3.5 py-1.5 font-display text-xs text-fog-muted shadow-sm">
              {stat}
            </span>
          ) : null}
        </div>

        <ul className="fade-up fade-up-delay-2 mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {PRODUCT_FAMILY.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-line bg-ink-soft px-3.5 py-2 font-display text-xs font-semibold text-fog no-underline shadow-sm transition hover:border-amber hover:text-amber sm:text-[0.8rem]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Classic modern split hero with illustration. */
function SplitHero({
  brandName,
  eyebrow,
  title,
  subtitle,
  cta,
  stat,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-[42%] h-[26rem] w-[26rem] -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--amber) 42%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="hero-modern__mesh pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center gap-10 px-5 py-14 sm:flex-row sm:items-center sm:gap-10 sm:px-8 sm:py-16 lg:gap-14 lg:py-20">
        <div className="relative z-10 w-full max-w-xl shrink-0 sm:max-w-[46%] lg:max-w-xl">
          <p className="fade-up font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-steel-bright">
            {eyebrow}
          </p>

          <p className="fade-up fade-up-delay-1 mt-3 font-display text-[clamp(2.75rem,8vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-fog">
            {brandName}
          </p>

          <h1 className="fade-up fade-up-delay-1 mt-4 max-w-lg font-serif text-[clamp(1.3rem,2.8vw,1.85rem)] font-medium leading-snug tracking-[-0.02em] text-fog">
            {title}
          </h1>

          <p className="fade-up fade-up-delay-2 mt-4 max-w-md text-[1rem] leading-relaxed text-fog-muted sm:text-[1.05rem]">
            {subtitle}
          </p>

          <div className="fade-up fade-up-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#blogs"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 font-display text-sm font-semibold text-white no-underline shadow-[0_12px_40px_color-mix(in_srgb,var(--amber)_35%,transparent)] transition hover:brightness-110"
            >
              {cta}
              <span aria-hidden>→</span>
            </a>
            {stat ? (
              <span className="rounded-full border border-line bg-ink-soft px-3.5 py-1.5 font-display text-xs text-fog-muted shadow-sm">
                {stat}
              </span>
            ) : null}
          </div>
        </div>

        <div className="fade-up fade-up-delay-2 relative z-10 w-full flex-1 sm:max-w-[52%]">
          <div className="relative mx-auto w-full max-w-md sm:ml-auto sm:max-w-none">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Modern theme hero — layout from `theme.heroLayout`:
 * - `split` (default): brand + illustration (Nexus-style)
 * - `centered`: marketing headline + product family chips (OneChannelAdmin-style)
 */
export default async function Hero(props: HeroProps) {
  const { theme, label } = await getTenant();
  const layout = String(
    theme.heroLayout ||
      // Until BFF carries heroLayout everywhere, keep OCA on the marketing hero.
      (label === "onechanneladmin" ? "centered" : "split")
  ).toLowerCase();

  if (layout === "centered" || layout === "marketing") {
    return <CenteredHero {...props} />;
  }

  return <SplitHero {...props} />;
}
