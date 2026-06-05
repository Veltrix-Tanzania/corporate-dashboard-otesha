import type { DateRangeKey, ImpactPeriod, MetricKey } from "./types";

export const ROUTE_STORAGE_KEY = "pt_route";

export const DEFAULT_ROUTE = { screen: "dashboard" as const, role: "exec" as const };

export const IMPACT_PERIODS: { key: ImpactPeriod; label: string }[] = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "custom", label: "Custom" },
];

export const DEFAULT_IMPACT_RANGE = {
  period: "month" as const,
  customStart: "2026-05-01",
  customEnd: "2026-06-05",
};

export const DATE_RANGES: { key: DateRangeKey; label: string; months: number }[] = [
  { key: "3m", label: "Last 3 months", months: 3 },
  { key: "6m", label: "Last 6 months", months: 6 },
  { key: "12m", label: "Last 12 months", months: 12 },
  { key: "all", label: "All time", months: 23 },
];

export const METRICS: {
  key: MetricKey;
  label: string;
  unit: string;
  color: string;
  word: string;
}[] = [
  { key: "trees", label: "Trees planted", unit: "", color: "oklch(0.55 0.11 150)", word: "trees in the ground" },
  { key: "verified", label: "Verified value", unit: "", color: "oklch(0.66 0.11 80)", word: "of verified impact" },
  // CO₂ stored — mock data only until backend provides monthly breakdown
  { key: "co2", label: "CO₂ stored (est.)", unit: " t", color: "oklch(0.5 0.12 150)", word: "tonnes captured" },
];
