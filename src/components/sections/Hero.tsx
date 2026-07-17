import { ThemeHero } from "@/components/themed/ThemeHero";

type HeroSectionProps = {
  stat?: string;
};

/** Homepage hero — resolved from `src/themes/<id>/components/Hero.tsx`. */
export async function Hero({ stat }: HeroSectionProps) {
  return <ThemeHero stat={stat} />;
}
