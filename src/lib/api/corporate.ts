import { apiClient, ApiError } from "./client";

export const NO_COMPANY_ASSIGNMENT_MESSAGE =
  "Your account is not assigned to a company yet. Please contact your administrator to get access.";

export function isNoCompanyAssignmentError(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false;
  if (err.status === 404 && /no company found/i.test(err.message)) return true;
  // Legacy backend response before null-check fix
  if (err.status === 500 && /cannot read properties of null/i.test(err.message)) return true;
  return false;
}

export function resolvePortalError(err: unknown): { message: string; unassigned: boolean } {
  if (isNoCompanyAssignmentError(err)) {
    return { message: NO_COMPANY_ASSIGNMENT_MESSAGE, unassigned: true };
  }
  if (err instanceof ApiError) {
    return { message: err.message, unassigned: false };
  }
  return { message: "Failed to load portal data", unassigned: false };
}

// ─── Backend response types ───────────────────────────────────────────────────

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  pagination?: unknown;
}

function unwrap<T>(res: ApiEnvelope<T>): T {
  return res.data;
}

export interface AuthUser {
  id: string;
  role: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface BackendCompany {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface BackendProjectTree {
  id: string;
  treeId: string;
  quantity: number;
  notes: string | null;
  tree: {
    id: string;
    name: string;
    specie: string;
    imageUrl: string | null;
    price?: number | string | null;
  };
}

export interface BackendProjectLocation {
  id: string;
  plantingSiteId: string;
  notes: string | null;
  trees?: BackendProjectTree[];
  plantingSite?: {
    id: string;
    name: string;
    cityName?: string;
    placeType?: string;
    latitude?: number | string;
    longitude?: number | string;
  };
}

export interface BackendProject {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  budgetAmount: string | null;
  budgetCurrency: string;
  status: "active" | "completed" | "cancelled";
  locations?: BackendProjectLocation[];
  createdAt: string;
  updatedAt: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function requestOtp(email: string): Promise<void> {
  await apiClient.post<unknown>("/auth/otp/request", { email, corporatePortal: true });
}

export async function verifyOtp(email: string, code: string): Promise<AuthResponse> {
  const res = await apiClient.post<ApiEnvelope<AuthResponse>>("/auth/otp/verify", { email, code });
  return unwrap(res);
}

// ─── Corporate data ───────────────────────────────────────────────────────────

export interface CompanyStats {
  activeProjects: number;
  totalProjects: number;
  totalTreesAllocated: number;
  totalTreesPlanted: number;
  totalInvestment: number;
  totalLocations: number;
}

export async function getMyStats(): Promise<CompanyStats> {
  const res = await apiClient.get<ApiEnvelope<CompanyStats>>("/corporate/me/stats");
  return unwrap(res);
}

export async function getMyCompany(): Promise<BackendCompany> {
  const res = await apiClient.get<ApiEnvelope<BackendCompany>>("/corporate/me/company");
  return unwrap(res);
}

export async function getMyProjects(): Promise<BackendProject[]> {
  const res = await apiClient.get<ApiEnvelope<BackendProject[]>>("/corporate/me/projects?limit=100");
  return unwrap(res) ?? [];
}

export async function getMyProject(id: string): Promise<BackendProject> {
  const res = await apiClient.get<ApiEnvelope<BackendProject>>(`/corporate/me/projects/${id}`);
  return unwrap(res);
}
