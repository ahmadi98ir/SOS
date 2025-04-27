import React, { useState, useEffect } from "react";
import { RequireAuth } from "../components/RequireAuth";
import { useAuth } from "../hooks/useAuth";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { EditProfileForm } from "../components/EditProfileForm";
import { AvatarUpload } from "../components/AvatarUpload";
import { NotificationsPanel } from "../components/NotificationsPanel";

const AVATAR_KEY = "profile-avatar";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(AVATAR_KEY);
      if (stored) setAvatar(stored);
    }
  }, []);

  const handleAvatarUpload = (url: string) => {
    setAvatar(url);
    if (typeof window !== "undefined") {
      localStorage.setItem(AVATAR_KEY, url);
    }
  };

  if (!user) return null;

  return (
    <RequireAuth>
      <div className="max-w-xl mx-auto mt-10 bg-white rounded shadow p-6 text-right" dir="rtl">
        <h1 className="text-2xl font-bold mb-4">پروفایل کاربر</h1>
        <AvatarUpload avatarUrl={avatar} onUpload={handleAvatarUpload} />
        <div className="mb-4 text-lg text-blue-800 font-semibold mt-4">
          سلام {username} عزیز، خوش آمدید!
        </div>
        <div className="mb-2">
          <span className="font-semibold">نام کاربری:</span> {username}
        </div>
        <div className="mb-4">
          <span className="font-semibold">نقش کاربری:</span> {user.role === "admin" ? "مدیر" : "کاربر"}
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
            onClick={() => setShowChangePassword((v) => !v)}
          >
            تغییر رمز عبور
          </button>
          <button
            className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition"
            onClick={() => setShowEditProfile((v) => !v)}
          >
            ویرایش نام کاربری
          </button>
        </div>
        {showChangePassword && <ChangePasswordForm />}
        {showEditProfile && (
          <EditProfileForm onSuccess={(newUsername) => setUsername(newUsername)} />
        )}
        <NotificationsPanel />
      </div>
    </RequireAuth>
  );
};

export default ProfilePage;
