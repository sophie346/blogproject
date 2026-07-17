import type { ThemePackage } from "@/themes/types";
import themeJson from "./theme.json";
import Hero from "./components/Hero";
import BlogCard from "./components/BlogCard";

/**
 * Child theme — only Hero + BlogCard override; Header/Footer fall back to default.
 */
const modernTheme: ThemePackage = {
  id: "modern",
  name: "Modern",
  config: themeJson as ThemePackage["config"],
  components: {
    Hero,
    BlogCard,
  },
};

export default modernTheme;
