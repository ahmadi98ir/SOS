"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterSchema = z.object({
  username: z.string().min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});
type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const RegisterForm: React.FC = () => {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = async (data: RegisterFormValues) => {
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "خطا در ثبت‌نام");
      } else {
        setSuccess("ثبت‌نام موفقیت‌آمیز بود");
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
      <h2 className="text-2xl font-bold mb-4">ثبت‌نام</h2>
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
        {isSubmitting ? "در حال ارسال..." : "ثبت‌نام"}
      </button>
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
};
