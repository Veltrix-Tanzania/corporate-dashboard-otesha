import type { ReportSettings } from "./types";

async function localFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const body = await res.json() as { data: T } | T;
  // Unwrap { data: T } envelope produced by the local API routes
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export const portalApi = {
  getSettings: () => localFetch<ReportSettings>("/api/v1/settings"),

  saveSettings: (settings: ReportSettings) =>
    localFetch<ReportSettings>("/api/v1/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};
