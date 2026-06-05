import type { ReportsQuery } from "@/lib/api/types";
import type { PortalResponse } from "@/lib/api/types";
import {
  FX,
  alerts,
  company,
  getSettings,
  monthly,
  portfolio,
  projects,
  reports,
  updateSettings,
} from "@/server/data/store";
import type { ReportSettings } from "@/lib/api/types";

export function getPortalData(): PortalResponse {
  return {
    fx: FX,
    company,
    projects,
    portfolio,
    reports,
    alerts,
    monthly,
  };
}

export function getProjectById(id: string) {
  return projects.find((p) => p.id === id) ?? null;
}

export function getReportById(id: string) {
  return reports.find((r) => r.id === id) ?? null;
}

export function filterReports(query: ReportsQuery = {}) {
  const { status = "all", projectId, monthsBack } = query;
  return reports.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (!projectId || projectId === "all" || r.projectId === projectId) &&
      (monthsBack == null || r.monthsBack <= monthsBack),
  );
}

export function getReportSettings() {
  return getSettings();
}

export function saveReportSettings(settings: ReportSettings) {
  return updateSettings(settings);
}
