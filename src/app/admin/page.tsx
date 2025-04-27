import React from "react";
import { AdminEmergencyRequestList } from "../../components/AdminEmergencyRequestList";
import { RequireAuth } from "../../components/RequireAuth";

export default function AdminPage() {
  return (
    <RequireAuth>
      <div dir="rtl" className="min-h-screen bg-gray-50 py-8 px-2">
        <h1 className="text-3xl font-bold text-right mb-6">داشبورد مدیریت درخواست‌های اضطراری</h1>
        <AdminEmergencyRequestList />
      </div>
    </RequireAuth>
  );
}
