import type { HeroProps } from "@/themes/types";

/** Default full-bleed editorial hero. */
export default function Hero({
  brandName,
  eyebrow,
  title,
  subtitle,
  cta,
  stat,
}: HeroProps) {
  return (
    <section className="hero-section hero-section--default relative min-h-[88vh] overflow-hidden">
      <div aria-hidden className="hero-wash hero-section__wash" />
      <div className="hero-section__grid" aria-hidden />
      <div className="relative mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-24 sm:px-8 sm:pb-24">
        <p className="hero-eyebrow fade-up">{eyebrow}</p>
        <p className="fade-up font-display text-5xl font-extrabold tracking-[-0.04em] text-fog sm:text-7xl md:text-8xl">
          {brandName}
        </p>
        <h1 className="fade-up fade-up-delay-1 mt-6 max-w-2xl font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">
          {title}
        </h1>
        <p className="fade-up fade-up-delay-2 mt-4 max-w-xl text-lg leading-relaxed text-fog-muted">
          {subtitle}
        </p>
        <div className="fade-up fade-up-delay-2 mt-10 flex flex-wrap items-center gap-4">
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
