"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const schema = z.object({
  currentPassword: z.string().min(8, "رمز عبور فعلی حداقل باید ۸ کاراکتر باشد"),
  newPassword: z.string().min(8, "رمز عبور جدید حداقل باید ۸ کاراکتر باشد"),
  confirmNewPassword: z.string().min(8, "تکرار رمز عبور جدید حداقل باید ۸ کاراکتر باشد"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "رمز عبور جدید و تکرار آن یکسان نیستند",
  path: ["confirmNewPassword"],
});

type ChangePasswordFormValues = z.infer<typeof schema>;

export const ChangePasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      const userId = localStorage.getItem("auth-data") ? JSON.parse(localStorage.getItem("auth-data")!).user?.userId : undefined;
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "خطا در تغییر رمز عبور");
      } else {
        toast.success("رمز عبور با موفقیت تغییر کرد. لطفاً دوباره وارد شوید.");
        reset();
        setTimeout(() => {
          localStorage.removeItem("auth-data");
          window.location.href = "/login";
        }, 1500);
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <form
      className="bg-white rounded shadow p-6 flex flex-col gap-4 max-w-md mx-auto mt-6 text-right"
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
    >
      <h3 className="text-xl font-bold mb-2">تغییر رمز عبور</h3>
      <div>
        <label className="block mb-1">رمز عبور فعلی</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <span className="text-red-500 text-xs">{errors.currentPassword.message}</span>
        )}
      </div>
      <div>
        <label className="block mb-1">رمز عبور جدید</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <span className="text-red-500 text-xs">{errors.newPassword.message}</span>
        )}
      </div>
      <div>
        <label className="block mb-1">تکرار رمز عبور جدید</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          {...register("confirmNewPassword")}
        />
        {errors.confirmNewPassword && (
          <span className="text-red-500 text-xs">{errors.confirmNewPassword.message}</span>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? "در حال ارسال..." : "تغییر رمز عبور"}
      </button>
    </form>
  );
};
