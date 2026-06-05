import { fail, ok } from "@/server/api/response";
import { getProjectById } from "@/server/services/portal.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) return fail("NOT_FOUND", `Project "${id}" not found`, 404);
  return ok(project);
}
