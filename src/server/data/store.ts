import type { Company, Monthly, Project, Report } from "@/lib/types";
import type { ReportSettings } from "@/lib/api/types";
import { BRAND_NAME } from "@/lib/brand";

export const FX = 2600;

const projects: Project[] = [
  {
    id: "dar-canopy",
    name: "Dar es Salaam Urban Canopy",
    short: "DOM city",
    blurb: "Street-tree and pocket-park reforestation across six wards of Dar es Salaam.",
    status: "Active",
    region: "Dar es Salaam · Coastal",
    started: "Mar 2024",
    budgetTZS: 420_000_000,
    trees: 38_400,
    survival: 0.89,
    co2: 712,
    locations: 6,
    canopyDelta: 8.4,
    ndviNow: 0.64,
    ndviBase: 0.41,
    species: 14,
    verifiedTZS: 486_000_000,
    sites: [
      { name: "Kinondoni Greenbelt", trees: 9200, lat: -6.752, lng: 39.218, surv: 0.91 },
      { name: "Ilala Civic Park", trees: 6400, lat: -6.823, lng: 39.281, surv: 0.86 },
      { name: "Temeke Wetland Edge", trees: 8100, lat: -6.951, lng: 39.352, surv: 0.88 },
      { name: "Ubungo Corridor", trees: 5600, lat: -6.784, lng: 39.183, surv: 0.9 },
      { name: "Kigamboni Dunes", trees: 4900, lat: -6.818, lng: 39.384, surv: 0.85 },
      { name: "Mbezi Nursery Block", trees: 4200, lat: -6.674, lng: 39.152, surv: 0.93 },
    ],
  },
  {
    id: "go-green",
    name: "Go Green Coastal Belt",
    short: "Go Green",
    blurb: "Native coastal woodland buffer protecting shoreline communities from erosion.",
    status: "Active",
    region: "Bagamoyo · Pwani",
    started: "Jun 2024",
    budgetTZS: 5_000_000,
    trees: 100,
    survival: 0.94,
    co2: 3,
    locations: 1,
    canopyDelta: 2.1,
    ndviNow: 0.52,
    ndviBase: 0.44,
    species: 4,
    verifiedTZS: 5_400_000,
    sites: [{ name: "Bagamoyo Shore Plot", trees: 100, lat: -6.442, lng: 38.904, surv: 0.94 }],
  },
  {
    id: "kili-watershed",
    name: "Kilimanjaro Watershed Restoration",
    short: "Kili Watershed",
    blurb: "Montane forest restoration safeguarding the Pangani river headwaters.",
    status: "Active",
    region: "Moshi · Kilimanjaro",
    started: "Nov 2023",
    budgetTZS: 610_000_000,
    trees: 61_800,
    survival: 0.86,
    co2: 1_284,
    locations: 9,
    canopyDelta: 14.2,
    ndviNow: 0.71,
    ndviBase: 0.48,
    species: 21,
    verifiedTZS: 742_000_000,
    sites: [
      { name: "Rau Forest Reserve", trees: 11200, lat: -3.362, lng: 37.352, surv: 0.88 },
      { name: "Materuni Slopes", trees: 9800, lat: -3.248, lng: 37.384, surv: 0.85 },
      { name: "Kikafu Gorge", trees: 8600, lat: -3.418, lng: 37.276, surv: 0.84 },
      { name: "Uru Highlands", trees: 7400, lat: -3.384, lng: 37.318, surv: 0.87 },
      { name: "Lyamungo Belt", trees: 6900, lat: -3.302, lng: 37.252, surv: 0.86 },
      { name: "Kibosho Ridge", trees: 6100, lat: -3.398, lng: 37.402, surv: 0.83 },
      { name: "Old Moshi Catchment", trees: 5800, lat: -3.448, lng: 37.298, surv: 0.88 },
    ],
  },
  {
    id: "pwani-mangrove",
    name: "Pwani Mangrove Initiative",
    short: "Pwani Mangrove",
    blurb: "Blue-carbon mangrove rehabilitation across the Rufiji delta.",
    status: "Active",
    region: "Rufiji · Pwani",
    started: "Aug 2024",
    budgetTZS: 205_000_000,
    trees: 28_100,
    survival: 0.82,
    co2: 341,
    locations: 4,
    canopyDelta: 6.8,
    ndviNow: 0.58,
    ndviBase: 0.39,
    species: 7,
    verifiedTZS: 254_000_000,
    sites: [
      { name: "Rufiji North Channel", trees: 9100, lat: -7.752, lng: 39.252, surv: 0.81 },
      { name: "Salale Estuary", trees: 7600, lat: -7.818, lng: 39.184, surv: 0.84 },
      { name: "Mafia Causeway", trees: 6300, lat: -7.918, lng: 39.552, surv: 0.8 },
      { name: "Kilwa Inlet", trees: 5100, lat: -8.948, lng: 39.518, surv: 0.83 },
    ],
  },
];

const sum = (k: keyof Project) =>
  projects.reduce((a, p) => a + (typeof p[k] === "number" ? (p[k] as number) : 0), 0);

const portfolio = {
  activeProjects: projects.length,
  trees: sum("trees"),
  co2: sum("co2"),
  investedTZS: sum("budgetTZS"),
  verifiedTZS: sum("verifiedTZS"),
  locations: sum("locations"),
  survival: 0.87,
  canopyDelta: 11.6,
  co2Trend: [180, 340, 560, 880, 1480, 2340],
  canopyTrend: [0, 2.1, 4.4, 6.9, 9.3, 11.6],
  quarters: ["Q1·24", "Q2·24", "Q3·24", "Q4·24", "Q1·25", "Q2·25"],
};

const reports: Report[] = [
  {
    id: "RPT-2026-0142",
    projectId: "kili-watershed",
    project: "Kilimanjaro Watershed Restoration",
    title: "Strong growth at Kilimanjaro",
    generated: "Jun 4, 2026 · 06:12",
    status: "new",
    monthsBack: 0,
    trigger: {
      type: "Canopy increase",
      delta: 14.2,
      threshold: 5.0,
      dir: "up",
      pass: "Jun 3, 2026",
      sensor: "Sentinel-2 L2A",
      cloud: 4,
      ndviBefore: 0.48,
      ndviAfter: 0.71,
      confidence: 0.96,
      tile: "37MET",
    },
    formats: ["dashboard", "pdf", "email"],
    headline:
      "Tree cover here is up 14.2% since the project began. That's the biggest jump we've recorded all year.",
  },
  {
    id: "RPT-2026-0138",
    projectId: "pwani-mangrove",
    project: "Pwani Mangrove Initiative",
    title: "Mangroves coming back in the Rufiji delta",
    generated: "Jun 2, 2026 · 05:48",
    status: "new",
    monthsBack: 0,
    trigger: {
      type: "Canopy increase",
      delta: 6.8,
      threshold: 5.0,
      dir: "up",
      pass: "Jun 1, 2026",
      sensor: "Sentinel-2 L2A",
      cloud: 11,
      ndviBefore: 0.39,
      ndviAfter: 0.58,
      confidence: 0.91,
      tile: "37LCH",
    },
    formats: ["dashboard", "pdf", "email"],
    headline: "New mangrove growth is coming through at Rufiji North Channel and Salale Estuary.",
  },
  {
    id: "RPT-2026-0131",
    projectId: "dar-canopy",
    project: "Dar es Salaam Urban Canopy",
    title: "Q2 satellite update",
    generated: "May 28, 2026 · 06:03",
    status: "reviewed",
    monthsBack: 0,
    trigger: {
      type: "Canopy increase",
      delta: 8.4,
      threshold: 5.0,
      dir: "up",
      pass: "May 27, 2026",
      sensor: "Sentinel-2 L2A",
      cloud: 7,
      ndviBefore: 0.41,
      ndviAfter: 0.64,
      confidence: 0.94,
      tile: "37MCT",
    },
    formats: ["dashboard", "pdf", "email"],
    headline: "Tree cover across the six wards held steady as the dry season started.",
  },
  {
    id: "RPT-2026-0117",
    projectId: "dar-canopy",
    project: "Dar es Salaam Urban Canopy",
    title: "Dry patch spotted at Kigamboni Dunes",
    generated: "May 14, 2026 · 05:51",
    status: "reviewed",
    monthsBack: 1,
    trigger: {
      type: "Vegetation stress",
      delta: -3.1,
      threshold: -3.0,
      dir: "down",
      pass: "May 13, 2026",
      sensor: "Sentinel-2 L2A",
      cloud: 9,
      ndviBefore: 0.57,
      ndviAfter: 0.51,
      confidence: 0.88,
      tile: "37MCT",
    },
    formats: ["dashboard", "email"],
    headline:
      "A small dip in greenery at Kigamboni was flagged for a site visit. The irrigation has since been fixed.",
  },
  {
    id: "RPT-2026-0102",
    projectId: "kili-watershed",
    project: "Kilimanjaro Watershed Restoration",
    title: "Q1 satellite update",
    generated: "Apr 30, 2026 · 06:20",
    status: "reviewed",
    monthsBack: 1,
    trigger: {
      type: "Scheduled verification",
      delta: 9.1,
      threshold: 5.0,
      dir: "up",
      pass: "Apr 29, 2026",
      sensor: "Sentinel-2 L2A",
      cloud: 3,
      ndviBefore: 0.52,
      ndviAfter: 0.66,
      confidence: 0.95,
      tile: "37MET",
    },
    formats: ["dashboard", "pdf", "email"],
    headline: "First-quarter results are in and have been filed to the ESG register.",
  },
  {
    id: "RPT-2026-0091",
    projectId: "kili-watershed",
    project: "Kilimanjaro Watershed Restoration",
    title: "March satellite update",
    generated: "Mar 18, 2026 · 06:08",
    status: "reviewed",
    monthsBack: 3,
    trigger: {
      type: "Canopy increase",
      delta: 7.4,
      threshold: 5.0,
      dir: "up",
      pass: "Mar 17, 2026",
      sensor: "Sentinel-2 L2A",
      cloud: 6,
      ndviBefore: 0.5,
      ndviAfter: 0.62,
      confidence: 0.93,
      tile: "37MET",
    },
    formats: ["dashboard", "pdf", "email"],
    headline: "Steady growth through the rains across the upper catchment.",
  },
  {
    id: "RPT-2026-0078",
    projectId: "dar-canopy",
    project: "Dar es Salaam Urban Canopy",
    title: "January satellite update",
    generated: "Jan 22, 2026 · 06:01",
    status: "reviewed",
    monthsBack: 5,
    trigger: {
      type: "Canopy increase",
      delta: 5.6,
      threshold: 5.0,
      dir: "up",
      pass: "Jan 21, 2026",
      sensor: "Sentinel-2 L2A",
      cloud: 8,
      ndviBefore: 0.36,
      ndviAfter: 0.5,
      confidence: 0.92,
      tile: "37MCT",
    },
    formats: ["dashboard", "pdf"],
    headline: "New street trees are starting to show up from above.",
  },
  {
    id: "RPT-2025-0064",
    projectId: "pwani-mangrove",
    project: "Pwani Mangrove Initiative",
    title: "November satellite update",
    generated: "Nov 12, 2025 · 05:54",
    status: "reviewed",
    monthsBack: 7,
    trigger: {
      type: "Canopy increase",
      delta: 4.1,
      threshold: 5.0,
      dir: "up",
      pass: "Nov 11, 2025",
      sensor: "Sentinel-2 L2A",
      cloud: 13,
      ndviBefore: 0.34,
      ndviAfter: 0.45,
      confidence: 0.89,
      tile: "37LCH",
    },
    formats: ["dashboard", "email"],
    headline: "Early mangrove shoots taking hold along the channel.",
  },
  {
    id: "RPT-2025-0051",
    projectId: "go-green",
    project: "Go Green Coastal Belt",
    title: "September satellite update",
    generated: "Sep 5, 2025 · 06:15",
    status: "reviewed",
    monthsBack: 9,
    trigger: {
      type: "Scheduled check",
      delta: 1.4,
      threshold: 5.0,
      dir: "up",
      pass: "Sep 4, 2025",
      sensor: "Sentinel-2 L2A",
      cloud: 5,
      ndviBefore: 0.46,
      ndviAfter: 0.49,
      confidence: 0.9,
      tile: "37LCH",
    },
    formats: ["dashboard"],
    headline: "Coastal buffer holding steady at the start of the programme.",
  },
];

const alerts = [
  {
    id: "a1",
    kind: "report",
    reportId: "RPT-2026-0142",
    title: "A new satellite image is in",
    body: "We saved a fresh image of Kilimanjaro Watershed. Tree cover looks about 14.2% higher than the last one.",
    time: "2h ago",
  },
];

const monthLabels: string[] = [];
for (let i = 0; i < 24; i++) {
  const d = new Date(2024, 6 + i, 1);
  monthLabels.push(
    d.toLocaleString("en-US", { month: "short" }) + "·" + String(d.getFullYear()).slice(2),
  );
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (a: number, b: number, wobble = 0) =>
  monthLabels.map((_, i) => {
    const t = smooth(i / (monthLabels.length - 1));
    const w = wobble ? Math.sin(i * 1.7) * wobble * (1 - t) : 0;
    return a + (b - a) * t + w;
  });

const monthly: Monthly = {
  labels: monthLabels,
  trees: ramp(16_800, 128_400).map(Math.round),
  co2: ramp(96, 2_340).map(Math.round),
  canopy: ramp(0, 11.6, 0.25).map((v) => +Math.max(0, v).toFixed(1)),
  invested: ramp(165_000_000, 1_240_000_000).map((v) => Math.round(v)),
  verified: ramp(140_000_000, 1_487_400_000).map((v) => Math.round(v)),
};

export const company: Company = {
  name: "CRDB Bank",
  portal: BRAND_NAME,
  account: "CRDB",
  user: "Almas Mchauru",
  email: "almasemilius@icloud.com",
};

export { projects, portfolio, reports, alerts, monthly };

let settings: ReportSettings = {
  cadence: "Every pass",
  digest: "Weekly",
  toggles: {
    trees: true,
    cover: true,
    co2: true,
    value: true,
    pdf: true,
    email: true,
  },
};

export function getSettings() {
  return settings;
}

export function updateSettings(next: ReportSettings) {
  settings = next;
  return settings;
}
