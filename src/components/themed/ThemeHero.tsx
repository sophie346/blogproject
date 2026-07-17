import { getTenant } from "@/lib/tenant";
import { resolveThemeComponent } from "@/themes/resolve";

type ThemeHeroProps = {
  stat?: string;
};

/** Renders the active theme’s Hero, falling back to default. */
export async function ThemeHero({ stat }: ThemeHeroProps) {
  const { brand, copy, theme } = await getTenant();
  const Hero = resolveThemeComponent(theme.id, "Hero");

  return (
    <Hero
      brandName={brand.name}
      eyebrow={copy.heroEyebrow}
      title={copy.heroTitle}
      subtitle={copy.heroSubtitle}
      cta={copy.heroCta}
      stat={stat}
    />
  );
}
