import type { ClientDefinition } from "@/types/tenant";
import nexus from "./nexus";
import oneauto from "./oneauto";

/**
 * UI registry keyed by `themeKey` from `constants/tenants` Host mapping.
 */
export const clients: Record<string, ClientDefinition> = {
  oneauto,
  nexus,
};
