import type { HeroProps } from "@/themes/types";
import { HeroIllustration } from "./HeroIllustration";

/** Modern split hero with illustration — overrides default Hero. */
export default function Hero({
  brandName,
  eyebrow,
  title,
  subtitle,
  cta,
  stat,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-[42%] h-[26rem] w-[26rem] -translate-y-1/2 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--amber) 52%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="hero-modern__mesh pointer-events-none absolute inset-0 opacity-35"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center gap-8 px-5 py-12 sm:flex-row sm:items-center sm:gap-8 sm:px-8 sm:py-14 lg:gap-12 lg:py-16">
        <div className="relative z-10 w-full max-w-xl shrink-0 sm:max-w-[46%] lg:max-w-xl">
          <p className="fade-up font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-steel-bright">
            {eyebrow}
          </p>

          <p className="fade-up fade-up-delay-1 mt-3 font-display text-[clamp(2.75rem,8vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-fog">
            {brandName}
          </p>

          <h1 className="fade-up fade-up-delay-1 mt-4 max-w-md font-serif text-[clamp(1.25rem,2.8vw,1.7rem)] font-medium leading-snug tracking-[-0.02em] text-fog">
            {title}
          </h1>

          <p className="fade-up fade-up-delay-2 mt-3 max-w-md text-[0.98rem] leading-relaxed text-fog-muted sm:text-base">
            {subtitle}
          </p>

          <div className="fade-up fade-up-delay-2 mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#blogs"
              className="inline-flex items-center gap-2 rounded-xl bg-amber px-5 py-3 font-display text-sm font-semibold text-white no-underline shadow-[0_12px_40px_color-mix(in_srgb,var(--amber)_35%,transparent)] transition hover:brightness-110"
            >
              {cta}
              <span aria-hidden>→</span>
            </a>
            {stat ? (
              <span className="rounded-full border border-line bg-ink-soft/80 px-3.5 py-1.5 font-display text-xs text-fog-muted">
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
