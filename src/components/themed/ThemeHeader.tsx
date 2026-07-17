import { getTenant } from "@/lib/tenant";
import { resolveThemeComponent } from "@/themes/resolve";

/** Renders the active theme’s Header, falling back to default. */
export async function ThemeHeader() {
  const { theme } = await getTenant();
  const Header = resolveThemeComponent(theme.id, "Header");
  return <Header />;
}
