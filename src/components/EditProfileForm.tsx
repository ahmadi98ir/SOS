"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  username: z.string().min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد"),
});
type EditProfileFormValues = z.infer<typeof schema>;

export const EditProfileForm: React.FC<{ onSuccess?: (username: string) => void }> = ({ onSuccess }) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: user?.username || "" },
  });

  React.useEffect(() => {
    setValue("username", user?.username || "");
  }, [user, setValue]);

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      const res = await fetch("/api/edit-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "خطا در ویرایش اطلاعات کاربری");
      } else {
        toast.success("نام کاربری با موفقیت ویرایش شد");
        if (onSuccess) onSuccess(data.username);
        reset(data);
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
      <h3 className="text-xl font-bold mb-2">ویرایش نام کاربری</h3>
      <div>
        <label className="block mb-1">نام کاربری جدید</label>
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          {...register("username")}
        />
        {errors.username && (
          <span className="text-red-500 text-xs">{errors.username.message}</span>
        )}
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
    </form>
  );
};
