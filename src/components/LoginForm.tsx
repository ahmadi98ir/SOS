"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
  username: z.string().min(3, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});
type LoginFormValues = z.infer<typeof LoginSchema>;

export const LoginForm: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "ورود ناموفق، لطفاً اطلاعات خود را دوباره بررسی کنید");
      } else {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("username", result.username);
        if (onLogin) onLogin();
        reset();
      }
    } catch (e) {
      setError("خطا در ارتباط با سرور");
    }
  };

  return (
    <form
      className="bg-white rounded shadow p-6 flex flex-col gap-4 max-w-sm mx-auto mt-8 text-right"
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
    >
      <h2 className="text-2xl font-bold mb-4">ورود</h2>
      <div>
        <label className="block mb-1">نام کاربری</label>
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          {...register("username")}
        />
        {errors.username && (
          <span className="text-red-500 text-xs">{errors.username.message}</span>
        )}
      </div>
      <div>
        <label className="block mb-1">رمز عبور</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">{errors.password.message}</span>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? "در حال ورود..." : "ورود"}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
};
