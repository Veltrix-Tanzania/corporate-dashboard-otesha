import type { ImpactDateRange, Project, Report } from "./types";
import { filterReportsByRange, formatImpactPassDate } from "./metrics";

export type NdviSnapshot = {
  ndviNow: number;
  ndviBase: number;
  cloud: number;
  tile: string;
  seed: number;
  passDate: string;
};

const PERIOD_SEED: Record<ImpactDateRange["period"], number> = {
  week: 0,
  month: 2,
  year: 5,
  custom: 8,
};

function customSeedPart(range: ImpactDateRange) {
  if (!range.customStart || !range.customEnd) return 0;
  const raw = range.customStart.replace(/-/g, "") + range.customEnd.replace(/-/g, "");
  return raw.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 7;
}

function interpolateNdvi(project: Project, range: ImpactDateRange) {
  const span = project.ndviNow - project.ndviBase;
  const weights: Record<ImpactDateRange["period"], number> = {
    week: 0.95,
    month: 0.82,
    year: 0.58,
    custom: 0.7,
  };
  const w = weights[range.period];
  return +(project.ndviBase + span * w).toFixed(2);
}

export function deriveNdviSnapshot(
  project: Project,
  range: ImpactDateRange,
  reports: Report[],
): NdviSnapshot {
  const inRange = filterReportsByRange(
    reports.filter((r) => r.projectId === project.id),
    range,
  );
  const latest = inRange[0];

  const ndviNow = latest ? latest.trigger.ndviAfter : interpolateNdvi(project, range);
  const ndviBase = latest ? latest.trigger.ndviBefore : project.ndviBase;
  const cloud = latest?.trigger.cloud ?? (range.period === "week" ? 3 : range.period === "year" ? 9 : 4);
  const tile = latest?.trigger.tile ?? "37MET";

  return {
    ndviNow,
    ndviBase,
    cloud,
    tile,
    seed: (project.id.length % 6) + 1 + PERIOD_SEED[range.period] + customSeedPart(range),
    passDate: formatImpactPassDate(range),
  };
}
