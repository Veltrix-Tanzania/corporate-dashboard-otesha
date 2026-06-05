import type { DateRangeKey, ImpactDateRange, MetricKey, Monthly, Report } from "./types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseMonthLabel(label: string) {
  const [mon, yr] = label.split("·");
  const idx = MONTHS.indexOf(mon);
  return new Date(2000 + Number(yr), idx, 1);
}

function resolveIndices(M: Monthly, range: ImpactDateRange) {
  const n = M.labels.length;
  const end = n - 1;

  if (range.period === "custom" && range.customStart && range.customEnd) {
    const startDate = new Date(range.customStart);
    const endDate = new Date(range.customEnd);
    let start = 0;
    let last = end;
    for (let i = 0; i < n; i++) {
      const d = parseMonthLabel(M.labels[i]);
      if (d >= startDate) {
        start = i;
        break;
      }
    }
    for (let i = n - 1; i >= 0; i--) {
      const d = parseMonthLabel(M.labels[i]);
      if (d <= endDate) {
        last = i;
        break;
      }
    }
    return { start: Math.min(start, last), end: Math.max(start, last) };
  }

  const windows: Record<ImpactDateRange["period"], number> = {
    week: 1,
    month: 2,
    year: 13,
    custom: 6,
  };
  const span = windows[range.period];
  return { start: Math.max(0, end - (span - 1)), end };
}

export function sliceMetric(M: Monthly, key: MetricKey, months: number) {
  const n = M.labels.length;
  const start = Math.max(0, n - 1 - months);
  const series = M[key].slice(start);
  const rawLabels = M.labels.slice(start);
  const step = Math.ceil(rawLabels.length / 6);
  const labels = rawLabels.map((l, i) =>
    i % step === 0 || i === rawLabels.length - 1 ? l : "",
  );
  const impact = M[key][n - 1] - M[key][start];
  const pct = M[key][start] ? Math.round((impact / M[key][start]) * 100) : 100;
  return { series, labels, impact, pct, start, last: M[key][n - 1] };
}

export function sliceMetricByRange(M: Monthly, key: MetricKey, range: ImpactDateRange) {
  const { start, end } = resolveIndices(M, range);
  const series = M[key].slice(start, end + 1);
  const rawLabels = M.labels.slice(start, end + 1);
  const step = Math.max(1, Math.ceil(rawLabels.length / 6));
  const labels = rawLabels.map((l, i) =>
    i % step === 0 || i === rawLabels.length - 1 ? l : "",
  );
  const impact = M[key][end] - M[key][start];
  const pct = M[key][start] ? Math.round((impact / M[key][start]) * 100) : 100;
  return { series, labels, impact, pct, start, last: M[key][end] };
}

export function getPeriodPhrase(rangeKey: DateRangeKey, label: string) {
  return rangeKey === "all" ? "so far" : "in the " + label.toLowerCase();
}

export function getImpactPeriodPhrase(range: ImpactDateRange) {
  switch (range.period) {
    case "week":
      return "in the last week";
    case "month":
      return "in the last month";
    case "year":
      return "in the last year";
    case "custom":
      if (range.customStart && range.customEnd) {
        const fmt = (d: string) =>
          new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return `from ${fmt(range.customStart)} to ${fmt(range.customEnd)}`;
      }
      return "in the selected period";
  }
}

export function monthsBackForImpactRange(range: ImpactDateRange) {
  if (range.period === "week") return 0;
  if (range.period === "month") return 1;
  if (range.period === "year") return 12;
  if (range.customStart && range.customEnd) {
    const start = new Date(range.customStart);
    const end = new Date(range.customEnd);
    const diff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(0, diff);
  }
  return 6;
}

export function filterReportsByRange(reports: Report[], range: ImpactDateRange) {
  const maxBack = monthsBackForImpactRange(range);
  if (range.period === "custom") {
    return reports.filter((r) => r.monthsBack <= maxBack);
  }
  return reports.filter((r) => r.monthsBack <= maxBack);
}

export function formatImpactPassDate(range: ImpactDateRange) {
  if (range.period === "custom" && range.customEnd) {
    return new Date(range.customEnd).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return "Jun 3, 2026";
}
