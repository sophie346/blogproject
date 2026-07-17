import { DefaultHero } from "@/components/themes/DefaultHero";
import { LuxuryHero } from "@/components/themes/LuxuryHero";
import { ModernHero } from "@/components/themes/ModernHero";
import type { HeroProps } from "@/components/themes/hero-types";
import { getTenant } from "@/lib/tenant";
import type { ThemeId } from "@/types/theme";

const HERO_REGISTRY: Record<ThemeId, (props: HeroProps) => React.JSX.Element> = {
  default: DefaultHero,
  modern: ModernHero,
  luxury: LuxuryHero,
};

type HeroSectionProps = {
  stat?: string;
};

/** Selects the hero variant for the active tenant theme. */
export async function Hero({ stat }: HeroSectionProps) {
  const { brand, copy, theme } = await getTenant();
  const HeroVariant = HERO_REGISTRY[theme.id] || DefaultHero;

  return (
    <HeroVariant
      brandName={brand.name}
      eyebrow={copy.heroEyebrow}
      title={copy.heroTitle}
      subtitle={copy.heroSubtitle}
      cta={copy.heroCta}
      stat={stat}
    />
  );
}
