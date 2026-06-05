import type { BackendCompany, BackendProject, CompanyStats } from "./corporate";
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

export function toCompany(c: BackendCompany): Company {
  return {
    name: c.name,
    portal: "Otesha",
    account: c.name,
    user: "",
    email: "",
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

function toSite(loc: NonNullable<BackendProject["locations"]>[0]): Site | null {
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
    surv: 0.87, // mock — backend doesn't provide survival rate
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

export function toProject(p: BackendProject): Project {
  const trees = sumProjectTrees(p);
  const investmentTZS = computeInvestmentTZS(p);
  const sites = (p.locations ?? []).map(toSite).filter((s): s is Site => s !== null);

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
    survival: 0.87, // mock
    co2: Math.round(trees * 0.018), // mock estimate
    locations: p.locations?.length ?? 0,
    canopyDelta: 0, // mock
    ndviNow: 0, // mock
    ndviBase: 0, // mock
    species: 0, // mock
    verifiedTZS: investmentTZS, // verified value = total investment per requirements
    sites,
  };
}

export function toPortfolio(projects: Project[], stats: CompanyStats): Portfolio {
  // Use the DB-computed total directly — authoritative sum of budgetAmount across all projects
  const investedTZS = stats.totalInvestment;
  const verifiedTZS = stats.totalInvestment;

  // totalTreesAllocated = sum of quantity across all project tree entries (what the admin assigned).
  // totalTreesPlanted = sum of actual planting records logged by caretakers.
  // Show allocated as the headline count (matches panda-corporate behaviour); planted is used
  // when it exceeds allocated (i.e. over-delivery is recorded).
  const trees = Math.max(stats.totalTreesAllocated, stats.totalTreesPlanted);
  const co2 = Math.round(trees * 0.018); // mock estimate

  return {
    activeProjects: stats.activeProjects,
    trees,
    co2,
    investedTZS,
    verifiedTZS,
    locations: stats.totalLocations,
    survival: 0.87, // mock
    canopyDelta: 11.6, // mock
    co2Trend: [180, 340, 560, 880, 1480, co2 || 2340], // mock
    canopyTrend: [0, 2.1, 4.4, 6.9, 9.3, 11.6], // mock
    quarters: ["Q1·24", "Q2·24", "Q3·24", "Q4·24", "Q1·25", "Q2·25"],
  };
}

export function buildMonthly(totalTrees: number, totalVerifiedTZS: number): Monthly {
  // Scale mock ramps to end at real totals so chart trends match headline KPIs
  const treesStart = Math.round(totalTrees * 0.13);
  const verifiedStart = Math.round(totalVerifiedTZS * 0.11);

  return {
    labels: MOCK_MONTHLY_LABELS,
    trees: ramp(treesStart, totalTrees).map(Math.round),
    co2: ramp(96, 2_340).map(Math.round), // mock
    canopy: ramp(0, 11.6, 0.25).map((v) => +Math.max(0, v).toFixed(1)), // mock
    invested: ramp(Math.round(totalVerifiedTZS * 0.13), totalVerifiedTZS).map(Math.round),
    verified: ramp(verifiedStart, totalVerifiedTZS).map(Math.round),
  };
}
