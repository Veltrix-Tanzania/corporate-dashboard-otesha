import { ok } from "@/server/api/response";
import { getPortalData } from "@/server/services/portal.service";

export async function GET() {
  return ok(getPortalData());
}
