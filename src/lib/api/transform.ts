import type { BackendCompany, BackendProject, CompanyStats } from "./corporate";
import type { CorporateUser } from "@/lib/auth";
import type { Company, Monthly, Portfolio, Project, Site } from "@/lib/types";

// ─── Mock data preserved for fields the backend doesn't provide ───────────────

const MOCK_MONTHLY_LABELS: string[] = [];
for (let i = 0; i < 24; i++) {
  const d = new Date(2024, 6 + i, 1);
  MOCK_MONTHLY_LABELS.push(
    d.toLocaleString("en-US", { month: "short" }) + "·" + String(d.getFullYear()).slice(2)
  );
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (a: number, b: number, wobble = 0) =>
  MOCK_MONTHLY_LABELS.map((_, i) => {
    const t = smooth(i / (MOCK_MONTHLY_LABELS.length - 1));
    const w = wobble ? Math.sin(i * 1.7) * wobble * (1 - t) : 0;
    return a + (b - a) * t + w;
  });

// ─── Transformers ─────────────────────────────────────────────────────────────

export function toCompany(c: BackendCompany, authUser?: CorporateUser | null): Company {
  return {
    name: c.name,
    portal: "Otesha",
    account: c.name,
    user: authUser?.fullName ?? "",
    email: authUser?.email ?? "",
    description: c.description,
  };
}

function sumProjectTrees(p: BackendProject): number {
  return (
    p.locations?.reduce(
      (acc, loc) => acc + (loc.trees?.reduce((a, t) => a + t.quantity, 0) ?? 0),
      0
    ) ?? 0
  );
}

function toSite(loc: NonNullable<BackendProject["locations"]>[0], survivalRate: number): Site | null {
  const site = loc.plantingSite;
  if (!site) return null;
  const lat = parseFloat(String(site.latitude ?? ""));
  const lng = parseFloat(String(site.longitude ?? ""));
  if (!isFinite(lat) || !isFinite(lng)) return null;
  return {
    name: site.name,
    trees: loc.trees?.reduce((a, t) => a + t.quantity, 0) ?? 0,
    lat,
    lng,
    surv: survivalRate,
  };
}

function formatStarted(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function computeInvestmentTZS(p: BackendProject): number {
  if (!p.budgetAmount) return 0;
  const parsed = parseFloat(p.budgetAmount);
  return isNaN(parsed) ? 0 : parsed;
}

export function toProject(p: BackendProject, portfolioSurvival = 0.87): Project {
  const trees = sumProjectTrees(p);
  const investmentTZS = computeInvestmentTZS(p);

  // Count unique species from nested tree entries
  const species = new Set(
    (p.locations ?? [])
      .flatMap((loc) => (loc.trees ?? []).map((t) => t.tree.specie))
      .filter(Boolean)
  ).size;

  const sites = (p.locations ?? [])
    .map((loc) => toSite(loc, portfolioSurvival))
    .filter((s): s is Site => s !== null);

  return {
    id: p.id,
    name: p.name,
    short: p.name.split(" ").slice(0, 2).join(" "),
    blurb: p.description ?? "",
    status: p.status === "active" ? "Active" : p.status === "completed" ? "Completed" : "Cancelled",
    region: p.locations?.[0]?.plantingSite?.cityName ?? "",
    started: formatStarted(p.createdAt),
    budgetTZS: investmentTZS,
    trees,
    survival: portfolioSurvival,
    co2: Math.round(trees * 0.018), // estimated — no real CO2 endpoint yet
    locations: p.locations?.length ?? 0,
    canopyDelta: 0, // no backend endpoint yet
    ndviNow: 0,    // no backend endpoint yet
    ndviBase: 0,   // no backend endpoint yet
    species,
    verifiedTZS: investmentTZS,
    sites,
  };
}

export function toPortfolio(projects: Project[], stats: CompanyStats): Portfolio {
  const investedTZS = stats.totalInvestment;
  const verifiedTZS = stats.totalInvestment;

  const trees = Math.max(stats.totalTreesAllocated, stats.totalTreesPlanted);
  const co2 = Math.round(trees * 0.018); // estimated — no real CO2 endpoint yet

  // Real survival rate from backend stats
  const survival =
    stats.totalTreesAllocated > 0
      ? Math.min(stats.totalTreesPlanted / stats.totalTreesAllocated, 1)
      : 0;

  // Scale co2 trend to end at real co2 total
  const co2End = co2 || 1;
  const co2Trend = [
    Math.round(co2End * 0.08),
    Math.round(co2End * 0.15),
    Math.round(co2End * 0.24),
    Math.round(co2End * 0.38),
    Math.round(co2End * 0.63),
    co2End,
  ];

  return {
    activeProjects: stats.activeProjects,
    trees,
    co2,
    investedTZS,
    verifiedTZS,
    locations: stats.totalLocations,
    survival,
    canopyDelta: 11.6, // no backend endpoint yet
    co2Trend,
    canopyTrend: [0, 2.1, 4.4, 6.9, 9.3, 11.6], // no backend endpoint yet
    quarters: ["Q1·24", "Q2·24", "Q3·24", "Q4·24", "Q1·25", "Q2·25"],
  };
}

export function buildMonthly(totalTrees: number, totalVerifiedTZS: number): Monthly {
  // Ramps end at real totals; intermediate values are estimated (no historical endpoint yet)
  const treesStart = Math.round(totalTrees * 0.13);
  const co2End = Math.round(totalTrees * 0.018);
  const co2Start = Math.round(co2End * 0.13);
  const verifiedStart = Math.round(totalVerifiedTZS * 0.11);

  return {
    labels: MOCK_MONTHLY_LABELS,
    trees: ramp(treesStart, totalTrees).map(Math.round),
    co2: ramp(co2Start, co2End).map(Math.round),
    canopy: ramp(0, 11.6, 0.25).map((v) => +Math.max(0, v).toFixed(1)), // no backend endpoint yet
    invested: ramp(Math.round(totalVerifiedTZS * 0.13), totalVerifiedTZS).map(Math.round),
    verified: ramp(verifiedStart, totalVerifiedTZS).map(Math.round),
  };
}
