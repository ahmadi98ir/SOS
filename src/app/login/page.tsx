import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "../../components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    // If already logged in, redirect
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      router.replace("/admin");
    }
  }, [router]);
  return <LoginForm onLogin={() => router.replace("/admin")} />;
}
