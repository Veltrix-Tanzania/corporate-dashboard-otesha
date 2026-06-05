import type { Alert, Company, Monthly, Portfolio, Project, Report } from "@/lib/types";

export type ApiSuccess<T> = { data: T };

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

export type PortalResponse = {
  fx: number;
  company: Company;
  projects: Project[];
  portfolio: Portfolio;
  reports: Report[];
  alerts: Alert[];
  monthly: Monthly;
};

export type ReportSettings = {
  cadence: "Every pass" | "Monthly" | "Quarterly";
  digest: "Instant" | "Weekly" | "Monthly";
  toggles: {
    trees: boolean;
    cover: boolean;
    co2: boolean;
    value: boolean;
    pdf: boolean;
    email: boolean;
  };
};

export type ReportsQuery = {
  status?: "all" | "new" | "reviewed";
  projectId?: string;
  monthsBack?: number;
};
