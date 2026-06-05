export type Role = "exec" | "manager";

export type Screen =
  | "dashboard"
  | "projects"
  | "project"
  | "reports"
  | "report"
  | "settings";

export type Route = {
  screen: Screen;
  role: Role;
  id?: string;
};

export type Site = {
  name: string;
  trees: number;
  lat: number;
  lng: number;
  surv: number;
};

export type Project = {
  id: string;
  name: string;
  short: string;
  blurb: string;
  status: string;
  region: string;
  started: string;
  budgetTZS: number;
  trees: number;
  survival: number;
  co2: number;
  locations: number;
  canopyDelta: number;
  ndviNow: number;
  ndviBase: number;
  species: number;
  verifiedTZS: number;
  sites: Site[];
};

export type ReportTrigger = {
  type: string;
  delta: number;
  threshold: number;
  dir: "up" | "down";
  pass: string;
  sensor: string;
  cloud: number;
  ndviBefore: number;
  ndviAfter: number;
  confidence: number;
  tile: string;
};

export type Report = {
  id: string;
  projectId: string;
  project: string;
  title: string;
  generated: string;
  status: "new" | "reviewed";
  monthsBack: number;
  trigger: ReportTrigger;
  formats: ("dashboard" | "pdf" | "email")[];
  headline: string;
};

export type Alert = {
  id: string;
  kind: string;
  reportId: string;
  title: string;
  body: string;
  time: string;
};

export type Portfolio = {
  activeProjects: number;
  trees: number;
  co2: number;
  investedTZS: number;
  verifiedTZS: number;
  locations: number;
  survival: number;
  canopyDelta: number;
  co2Trend: number[];
  canopyTrend: number[];
  quarters: string[];
};

export type Monthly = {
  labels: string[];
  trees: number[];
  co2: number[];
  canopy: number[];
  invested: number[];
  verified: number[];
};

export type Company = {
  name: string;
  portal: string;
  account: string;
  user: string;
  email: string;
  description?: string | null;
};

export type DateRangeKey = "3m" | "6m" | "12m" | "all";

export type ImpactPeriod = "week" | "month" | "year" | "custom";

export type ImpactDateRange = {
  period: ImpactPeriod;
  customStart?: string;
  customEnd?: string;
};

export type MetricKey = "co2" | "trees" | "verified";

export type SiteWithProject = Site & { project?: string };
