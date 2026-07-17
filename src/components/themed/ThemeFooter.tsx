import { getTenant } from "@/lib/tenant";
import { resolveThemeComponent } from "@/themes/resolve";

/** Renders the active theme’s Footer, falling back to default. */
export async function ThemeFooter() {
  const { theme } = await getTenant();
  const Footer = resolveThemeComponent(theme.id, "Footer");
  return <Footer />;
}
