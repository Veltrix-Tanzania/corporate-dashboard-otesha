import { fail, ok } from "@/server/api/response";
import { getReportById } from "@/server/services/portal.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const report = getReportById(id);
  if (!report) return fail("NOT_FOUND", `Report "${id}" not found`, 404);
  return ok(report);
}
