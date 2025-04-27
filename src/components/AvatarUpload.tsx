"use client";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

interface AvatarUploadProps {
  avatarUrl?: string;
  onUpload?: (url: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatarUrl, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویری مجاز است.");
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.error("حجم تصویر نباید بیشتر از ۱ مگابایت باشد.");
      return;
    }
    setUploading(true);
    // شبیه‌سازی آپلود: تبدیل به base64 و ذخیره موقت
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      if (onUpload) onUpload(reader.result as string);
      toast.success("تصویر پروفایل با موفقیت بارگذاری شد.");
      setUploading(false);
    };
    reader.onerror = () => {
      toast.error("خطا در خواندن فایل تصویر.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4" dir="rtl">
      <div className="w-32 h-32 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
        {preview ? (
          <img src={preview} alt="آواتار" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">بدون تصویر</span>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="bg-purple-600 text-white rounded px-4 py-2 hover:bg-purple-700 transition"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "در حال بارگذاری..." : "انتخاب تصویر پروفایل"}
      </button>
    </div>
  );
};
