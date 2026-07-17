import type { ClientDefinition } from "@/types/tenant";
import nexus from "./nexus";
import oneauto from "./oneauto";

/**
 * Registry of client definitions. Keys match `src/clients/<key>.ts`
 * and `src/data/themes/<key>.json`. Host mounts reference these modules.
 */
export const clients: Record<string, ClientDefinition> = {
  oneauto,
  nexus,
};
