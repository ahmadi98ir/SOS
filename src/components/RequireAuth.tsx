"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (requiredRole && user.role !== requiredRole) {
        setUnauthorized(true);
      }
    }
  }, [user, loading, router, requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-700" dir="rtl">
        در حال بررسی نشست کاربر...
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-red-600" dir="rtl">
        شما مجاز به مشاهده این صفحه نیستید
      </div>
    );
  }

  return <>{children}</>;
};
