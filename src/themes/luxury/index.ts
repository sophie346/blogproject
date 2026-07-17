import type { ThemePackage } from "@/themes/types";
import themeJson from "./theme.json";
import Hero from "./components/Hero";

/**
 * Child theme — only Hero overrides; everything else uses default.
 */
const luxuryTheme: ThemePackage = {
  id: "luxury",
  name: "Luxury",
  config: themeJson as ThemePackage["config"],
  components: {
    Hero,
  },
};

export default luxuryTheme;
