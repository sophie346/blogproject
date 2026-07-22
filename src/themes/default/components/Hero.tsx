import type { HeroProps } from "@/themes/types";

/** Default compact editorial hero (no full-viewport padding). */
export default function Hero({
  brandName,
  eyebrow,
  title,
  subtitle,
  cta,
  stat,
}: HeroProps) {
  return (
    <section className="hero-section hero-section--default relative overflow-hidden border-b border-line">
      <div aria-hidden className="hero-wash hero-section__wash" />
      <div className="hero-section__grid" aria-hidden />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-5 py-8 sm:px-8 sm:py-10">
        <p className="hero-eyebrow fade-up">{eyebrow}</p>
        <p className="fade-up mt-2 font-display text-4xl font-extrabold tracking-[-0.04em] text-fog sm:text-5xl md:text-6xl">
          {brandName}
        </p>
        <h1 className="fade-up fade-up-delay-1 mt-3 max-w-2xl font-display text-xl font-semibold tracking-tight text-fog sm:text-2xl">
          {title}
        </h1>
        <p className="fade-up fade-up-delay-2 mt-3 max-w-xl text-base leading-relaxed text-fog-muted">
          {subtitle}
        </p>
        <div className="fade-up fade-up-delay-2 mt-6 flex flex-wrap items-center gap-3">
          <a href="#blogs" className="hero-cta">
            {cta}
            <span aria-hidden>↓</span>
          </a>
          {stat ? <span className="hero-stat">{stat}</span> : null}
        </div>
      </div>
    </section>
  );
}
