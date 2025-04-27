// ابزارهای مدیریت توکن و نشست
import type { AuthTokens, AuthUser } from "../contexts/AuthContext";

const AUTH_KEY = "auth-data";

export function setAuthToStorage(user: AuthUser | null, tokens: AuthTokens | null) {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ user, tokens })
  );
}

export function getAuthFromStorage(): { user: AuthUser; tokens: AuthTokens } | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    if (!parsed.user || !parsed.tokens) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearAuthStorage() {
  localStorage.removeItem(AUTH_KEY);
}
