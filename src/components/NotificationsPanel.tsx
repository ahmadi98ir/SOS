"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  read: boolean;
  createdAt: string;
}

const NOTIFICATIONS_KEY = "user-notifications";

import { useSocket } from "../hooks/useSocket";

export const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [showUnread, setShowUnread] = useState(false);
  const { message } = useSocket("ws://localhost:3001");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("auth-data");
      if (auth) {
        const parsed = JSON.parse(auth);
        setUserId(parsed.user?.userId);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/notifications?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // دریافت اعلان بلادرنگ از WebSocket
  useEffect(() => {
    if (!message || !userId) return;
    // اگر اعلان برای کاربر فعلی است (یا برای همه)
    if ((message.userId && message.userId === userId) || message.userId === "all") {
      setNotifications((prev) => [{
        id: message.id || Date.now().toString(),
        message: message.message,
        type: message.type,
        read: false,
        createdAt: new Date().toISOString(),
      }, ...prev]);
      toast(message.message, { icon: message.type === "success" ? "✅" : message.type === "error" ? "❌" : "ℹ️" });
    }
  }, [message, userId]);

  const markAsRead = async (id: string) => {
    if (!userId) return;
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, notificationId: id }),
    });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };
  const markAllAsRead = async () => {
    if (!userId) return;
    await Promise.all(
      notifications.filter((n) => !n.read).map((n) => markAsRead(n.id))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = showUnread ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="bg-white shadow rounded p-4 w-full max-w-lg mx-auto mt-6 rtl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg">اعلان‌ها</h2>
          <span className={`inline-block min-w-[24px] text-center rounded-full text-xs px-2 py-0.5 ${unreadCount > 0 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"}`}>{unreadCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`text-xs rounded px-2 py-1 ${showUnread ? "bg-blue-600 text-white" : "bg-blue-100 hover:bg-blue-200"}`}
            onClick={() => setShowUnread(!showUnread)}
          >
            {showUnread ? "نمایش همه" : "فقط خوانده‌نشده‌ها"}
          </button>
          <button
            className="text-xs bg-green-100 rounded px-2 py-1 hover:bg-green-200"
            onClick={markAllAsRead}
          >
            علامت‌گذاری همه به عنوان خوانده‌شده
          </button>
        </div>
      </div>
      <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
        {loading ? (
          <li className="py-4 text-gray-400 text-center">در حال بارگذاری...</li>
        ) : filteredNotifications.length === 0 ? (
          <li className="py-4 text-gray-400 text-center">هیچ اعلانی وجود ندارد.</li>
        ) : filteredNotifications.map((n) => (
          <li
            key={n.id}
            className={`py-2 px-1 flex items-center gap-2 ${n.read ? "bg-gray-50" : "bg-yellow-50"}`}
          >
            <span className="text-xl">
              {n.type === "success" ? "✅" : n.type === "error" ? "❌" : "ℹ️"}
            </span>
            <span className={`flex-1 ${n.read ? "text-gray-400" : "text-gray-800 font-semibold"}`}>{n.message}</span>
            {!n.read && (
              <button
                className="text-xs bg-blue-100 rounded px-2 py-1 hover:bg-blue-200"
                onClick={() => markAsRead(n.id)}
              >
                خواندم
              </button>
            )}
            <button
              className="text-xs bg-red-100 rounded px-2 py-1 hover:bg-red-200 text-red-700 ml-2"
              onClick={async () => {
                if (window.confirm("آیا از حذف این اعلان مطمئن هستید؟")) {
                  if (!userId) return;
                  const res = await fetch("/api/delete-notification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notificationId: n.id, userId }),
                  });
                  const result = await res.json();
                  if (res.ok) {
                    setNotifications((prev) => prev.filter((x) => x.id !== n.id));
                    toast.success("اعلان حذف شد.");
                  } else {
                    toast.error(result.message || "خطا در حذف اعلان");
                  }
                }
              }}
            >
              حذف
            </button>
            <span className="text-xs text-gray-400 ml-2">{new Date(n.createdAt).toLocaleTimeString("fa-IR")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
