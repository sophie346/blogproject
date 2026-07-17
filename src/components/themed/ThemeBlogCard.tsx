import { getTenant } from "@/lib/tenant";
import { resolveThemeComponent } from "@/themes/resolve";
import type { BlogCardProps } from "@/themes/types";

/** Renders the active theme’s BlogCard, falling back to default. */
export async function ThemeBlogCard(props: BlogCardProps) {
  const { theme } = await getTenant();
  const BlogCard = resolveThemeComponent(theme.id, "BlogCard");
  return <BlogCard {...props} />;
}
