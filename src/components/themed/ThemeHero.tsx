import { getTenant } from "@/lib/tenant";
import { resolveThemeComponent } from "@/themes/resolve";

type ThemeHeroProps = {
  stat?: string;
};

/** Renders the active theme’s Hero, falling back to default. */
export async function ThemeHero({ stat }: ThemeHeroProps) {
  const { brand, copy, theme, pageSeo } = await getTenant();
  const Hero = resolveThemeComponent(theme.id, "Hero");

  // Prefer homepage pageSeo (ChannelAdmin /blog title + description) over
  // generic copy.hero* placeholders like "Guides from…".
  const title =
    String(pageSeo?.metaTitle || pageSeo?.title || copy.heroTitle || "").trim() ||
    copy.heroTitle;
  const subtitle =
    String(
      pageSeo?.metaDescription ||
        pageSeo?.description ||
        copy.heroSubtitle ||
        ""
    ).trim() || copy.heroSubtitle;

  return (
    <Hero
      brandName={brand.name}
      eyebrow={copy.heroEyebrow}
      title={title}
      subtitle={subtitle}
      cta={copy.heroCta}
      stat={stat}
    />
  );
}
