"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMyCompany, getMyProject, getMyProjects, getMyStats } from "@/lib/api/corporate";
import type { CompanyStats } from "@/lib/api/corporate";
import { toCompany, toProject, toPortfolio, buildMonthly } from "@/lib/api/transform";
import { ApiError } from "@/lib/api/client";
import { fmtTZS, fmtUSD, usd } from "@/lib/format";
import type { Alert, Company, Monthly, Portfolio, Project, Report } from "@/lib/types";

// ─── Mock data preserved for fields the backend doesn't provide ───────────────

const MOCK_REPORTS: Report[] = [
  {
    id: "RPT-2026-0142",
    projectId: "",
    project: "—",
    title: "Strong growth detected",
    generated: "Jun 4, 2026 · 06:12",
    status: "new",
    monthsBack: 0,
    trigger: {
      type: "Canopy increase", delta: 14.2, threshold: 5.0, dir: "up",
      pass: "Jun 3, 2026", sensor: "Sentinel-2 L2A", cloud: 4,
      ndviBefore: 0.48, ndviAfter: 0.71, confidence: 0.96, tile: "37MET",
    },
    formats: ["dashboard", "pdf", "email"],
    headline: "Tree cover is up significantly since the project began.",
  },
];

const MOCK_ALERTS: Alert[] = [
  {
    id: "a1",
    kind: "report",
    reportId: "RPT-2026-0142",
    title: "A new satellite image is in",
    body: "We saved a fresh satellite image. Tree cover looks higher than the last one.",
    time: "2h ago",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface PortalData {
  fx: number;
  company: Company;
  projects: Project[];
  portfolio: Portfolio;
  reports: Report[];
  alerts: Alert[];
  monthly: Monthly;
}

type PortalContextValue = PortalData & {
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  projectById: (id: string) => Project | undefined;
  reportById: (id: string) => Report | undefined;
  usd: (tzs: number) => number;
  fmtTZS: (n: number) => string;
  fmtUSD: (n: number) => string;
};

const PortalContext = createContext<PortalContextValue | null>(null);

const emptyCompany: Company = { name: "", portal: "", account: "", user: "", email: "" };
const emptyPortfolio: Portfolio = {
  activeProjects: 0, trees: 0, co2: 0, investedTZS: 0, verifiedTZS: 0,
  locations: 0, survival: 0, canopyDelta: 0, co2Trend: [], canopyTrend: [], quarters: [],
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortalData>({
    fx: 2600,
    company: emptyCompany,
    projects: [],
    portfolio: emptyPortfolio,
    reports: MOCK_REPORTS,
    alerts: MOCK_ALERTS,
    monthly: { labels: [], trees: [], co2: [], canopy: [], invested: [], verified: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [backendCompany, projectList, stats] = await Promise.all([
        getMyCompany(),
        getMyProjects(),
        getMyStats(),
      ]);

      // Fetch each project's full detail in parallel to get nested locations + plantingSite coords.
      const backendProjects = await Promise.all(
        projectList.map((p) => getMyProject(p.id))
      );

      const projects = backendProjects.map(toProject);
      const portfolio = toPortfolio(projects, stats);
      const monthly = buildMonthly(stats.totalTreesPlanted, portfolio.verifiedTZS);

      // Wire mock reports to the first real project id so navigation works
      const firstId = projects[0]?.id ?? "";
      const reports = MOCK_REPORTS.map((r) => ({ ...r, projectId: firstId, project: projects[0]?.name ?? "—" }));

      setData({
        fx: 2600,
        company: toCompany(backendCompany),
        projects,
        portfolio,
        reports,
        alerts: MOCK_ALERTS.map((a) => ({
          ...a,
          reportId: reports[0]?.id ?? a.reportId,
        })),
        monthly,
      });
    } catch (e) {
      const message = e instanceof ApiError ? e.message : "Failed to load portal data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const value = useMemo<PortalContextValue>(
    () => ({
      ...data,
      loading,
      error,
      refetch,
      projectById: (id) => data.projects.find((p) => p.id === id),
      reportById: (id) => data.reports.find((r) => r.id === id),
      usd,
      fmtTZS,
      fmtUSD,
    }),
    [data, loading, error, refetch]
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalProvider");
  return ctx;
}
