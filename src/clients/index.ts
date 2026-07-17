import type { ClientDefinition } from "@/types/tenant";
import nexus from "./nexus";
import oneauto from "./oneauto";

/**
 * Registry of known clients. Add new client definition files here.
 * Keys must be lowercase and match CLIENT_NAME values.
 */
export const clients: Record<string, ClientDefinition> = {
  oneauto,
  nexus,
};
