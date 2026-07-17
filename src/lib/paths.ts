import { toPublicPath } from "@/constants/tenants";
import { getTenant } from "@/lib/tenant";

/**
 * Public href for in-app links (includes pathPrefix mount).
 * Pass internal app paths: `/`, `/blog/slug`, `/category/x`, `/#stories`.
 */
export async function siteHref(appPath: string): Promise<string> {
  const { pathPrefix } = await getTenant();
  const prefix = pathPrefix || "";

  if (appPath.includes("#")) {
    const [pathPart, hashPart] = appPath.split("#");
    const pub = toPublicPath(prefix || "/", pathPart || "/");
    return `${pub}#${hashPart}`;
  }

  return toPublicPath(prefix || "/", appPath);
}
