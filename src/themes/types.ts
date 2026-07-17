import type { ComponentType } from "react";
import type { BlogListItem } from "@/types/blog";
import type { ThemeConfig, ThemeId } from "@/types/theme";

export type { ThemeId, ThemeConfig };

/** Slots a theme may override. Missing slots fall back to `default`. */
export type ThemeSlot = "Header" | "Footer" | "Hero" | "BlogCard";

export type HeroProps = {
  brandName: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  stat?: string;
};

export type BlogCardProps = {
  post: BlogListItem;
  index?: number;
};

export type ThemeComponents = {
  Header: ComponentType;
  Footer: ComponentType;
  Hero: ComponentType<HeroProps>;
  BlogCard: ComponentType<BlogCardProps>;
};

/** Partial overrides — anything omitted uses the default theme. */
export type ThemeComponentOverrides = Partial<ThemeComponents>;

export type ThemePackage = {
  id: ThemeId;
  /** Display name for docs / admin. */
  name: string;
  config: ThemeConfig;
  /** Only define components this theme overrides (or all for default). */
  components: ThemeComponentOverrides;
};
