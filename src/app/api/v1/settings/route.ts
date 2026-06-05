import type { ReportSettings } from "@/lib/api/types";
import { fail, ok } from "@/server/api/response";
import { getReportSettings, saveReportSettings } from "@/server/services/portal.service";

export async function GET() {
  return ok(getReportSettings());
}

export async function PUT(req: Request) {
  let body: ReportSettings;
  try {
    body = (await req.json()) as ReportSettings;
  } catch {
    return fail("INVALID_JSON", "Request body must be valid JSON", 400);
  }

  if (!body.cadence || !body.digest || !body.toggles) {
    return fail("VALIDATION_ERROR", "Missing required settings fields", 400);
  }

  return ok(saveReportSettings(body));
}
