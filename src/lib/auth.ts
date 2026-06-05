export const AUTH_TOKEN_KEY = "corp_accessToken";
export const USER_KEY = "corp_currentUser";

export interface CorporateUser {
  id: string;
  role: "corporate_user" | "admin";
  fullName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
}

export function setAuth(token: string, user: CorporateUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (e) {
    console.warn("[auth] setAuth failed", e);
  }
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getCurrentUser(): CorporateUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CorporateUser) : null;
  } catch {
    return null;
  }
}
