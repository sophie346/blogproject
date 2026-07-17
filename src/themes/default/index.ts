import type { ThemePackage } from "@/themes/types";
import themeJson from "./theme.json";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import BlogCard from "./components/BlogCard";

/**
 * Parent / base theme (WordPress “parent theme”).
 * All slots defined here — child themes only override what they need.
 */
const defaultTheme: ThemePackage = {
  id: "default",
  name: "Default",
  config: themeJson as ThemePackage["config"],
  components: {
    Header,
    Footer,
    Hero,
    BlogCard,
  },
};

export default defaultTheme;
