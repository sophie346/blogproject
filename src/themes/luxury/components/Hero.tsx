import type { HeroProps } from "@/themes/types";

/** Luxury centered hero — overrides default Hero. */
export default function Hero({
  brandName,
  eyebrow,
  title,
  subtitle,
  cta,
  stat,
}: HeroProps) {
  return (
    <section className="hero-section hero-section--luxury relative min-h-[92vh] overflow-hidden">
      <div aria-hidden className="hero-wash hero-section__wash" />
      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-4xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <p className="hero-eyebrow fade-up">{eyebrow}</p>
        <p className="fade-up hero-luxury__brand mt-4 font-display text-sm uppercase tracking-[0.4em] text-amber-soft">
          {brandName}
        </p>
        <h1 className="fade-up fade-up-delay-1 mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-fog sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <div className="hero-luxury__rule fade-up fade-up-delay-1" aria-hidden />
        <p className="fade-up fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-fog-muted">
          {subtitle}
        </p>
        <div className="fade-up fade-up-delay-2 mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#stories" className="hero-cta">
            {cta}
            <span aria-hidden>↓</span>
          </a>
          {stat ? <span className="hero-stat">{stat}</span> : null}
        </div>
      </div>
    </section>
  );
}
