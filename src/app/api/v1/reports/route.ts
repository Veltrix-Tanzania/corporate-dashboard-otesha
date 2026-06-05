import { ok } from "@/server/api/response";
import { filterReports } from "@/server/services/portal.service";
import type { ReportsQuery } from "@/lib/api/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query: ReportsQuery = {
    status: (searchParams.get("status") as ReportsQuery["status"]) ?? "all",
    projectId: searchParams.get("projectId") ?? undefined,
    monthsBack: searchParams.get("monthsBack")
      ? Number(searchParams.get("monthsBack"))
      : undefined,
  };
  return ok(filterReports(query));
}
