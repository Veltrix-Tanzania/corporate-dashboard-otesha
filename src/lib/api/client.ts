import { AUTH_TOKEN_KEY, clearAuth } from "@/lib/auth";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getBaseUrl(): string {
  // Always route through the Next.js proxy to avoid CORS.
  // Browser: relative /proxy path (same origin → Next.js rewrites to backend)
  // Server: full URL needed for SSR/RSC, but this client is client-only
  if (typeof window !== "undefined") return "/proxy/api/v1";
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://panda-project-be-production.up.railway.app";
  return `${backendUrl.replace(/\/$/, "")}/api/v1`;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function tryParse(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function handle401(): never {
  clearAuth();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
  throw new ApiError("Session expired. Please sign in again.", 401);
}

async function request<T>(
  method: string,
  path: string,
  options: { body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (options.auth !== false) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Network error — could not reach the server.", 0);
  }

  if (res.status === 401) {
    return handle401();
  }

  const text = await res.text();
  const data = tryParse(text);

  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "message" in (data as object)
        ? String((data as { message: unknown }).message)
        : typeof data === "string" && data.length < 200
          ? data
          : `${res.status} ${res.statusText}`;
    throw new ApiError(msg, res.status);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, { body, auth: false }),
  postAuth: <T>(path: string, body: unknown) => request<T>("POST", path, { body }),
};
