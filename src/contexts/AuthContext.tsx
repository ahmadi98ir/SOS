"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { clearAuthStorage, getAuthFromStorage, setAuthToStorage } from "../utils/authHelpers";

export interface AuthUser {
  userId: string;
  username: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  refreshTokenExpires: number;
}

interface AuthContextType {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hydrate from localStorage
  useEffect(() => {
    const stored = getAuthFromStorage();
    if (stored) {
      setUser(stored.user);
      setTokens(stored.tokens);
    }
    setLoading(false);
  }, []);

  // Auto-refresh token if expired
  useEffect(() => {
    if (!tokens) return;
    const now = Date.now();
    if (tokens.accessTokenExpires < now) {
      refreshToken();
    } else {
      const timeout = setTimeout(() => refreshToken(), tokens.accessTokenExpires - now - 2000);
      return () => clearTimeout(timeout);
    }
  }, [tokens]);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "ورود ناموفق بود");
        setLoading(false);
        return;
      }
      const user: AuthUser = { userId: data.userId, username: data.username, role: data.role || "user" };
      const tokens: AuthTokens = {
        accessToken: data.accessToken,
        accessTokenExpires: data.accessTokenExpires,
        refreshToken: data.refreshToken,
        refreshTokenExpires: data.refreshTokenExpires,
      };
      setUser(user);
      setTokens(tokens);
      setAuthToStorage(user, tokens);
      toast.success("ورود موفقیت‌آمیز بود");
      router.replace("/admin");
    } catch (e) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (tokens?.refreshToken) {
        await fetch("/api/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
      }
    } catch {}
    setUser(null);
    setTokens(null);
    clearAuthStorage();
    toast.success("خروج با موفقیت انجام شد");
    router.replace("/login");
    setLoading(false);
  }, [router, tokens]);

  const refreshToken = useCallback(async () => {
    if (!tokens?.refreshToken) return logout();
    try {
      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("رفرش توکن نامعتبر است");
      setTokens((prev) => prev ? { ...prev, accessToken: data.accessToken, accessTokenExpires: data.accessTokenExpires } : null);
      setAuthToStorage(user, {
        ...tokens,
        accessToken: data.accessToken,
        accessTokenExpires: data.accessTokenExpires,
      });
      toast.success("توکن تمدید شد");
    } catch {
      toast.error("نشست شما منقضی شده است، لطفاً دوباره وارد شوید");
      logout();
    }
  }, [tokens, user, logout]);

  return (
    <AuthContext.Provider value={{ user, tokens, loading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext باید در AuthProvider استفاده شود");
  return ctx;
};
