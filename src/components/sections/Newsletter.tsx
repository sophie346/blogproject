type NewsletterProps = {
  heading?: string;
  message?: string;
  brandName: string;
};

/** Presentational newsletter call-to-action. No backend wiring yet; the
 * form posts nowhere by default so tenants can attach their own action. */
export function Newsletter({
  heading = "Stay in the loop",
  message = "New blogs, straight to your inbox. No spam.",
  brandName,
}: NewsletterProps) {
  return (
    <section
      id="newsletter"
      className="newsletter-section scroll-mt-8 px-5 py-20 sm:px-8"
      aria-labelledby="newsletter-heading"
    >
      <div className="newsletter-card mx-auto w-full max-w-4xl p-8 sm:p-12">
        <div className="newsletter-card__body">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-steel-bright">
            {brandName}
          </p>
          <h2
            id="newsletter-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-fog-muted">
            {message}
          </p>
          <form className="newsletter-form" aria-label="Newsletter signup">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="newsletter-form__input"
              aria-label="Email address"
            />
            <button type="submit" className="newsletter-form__button">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
