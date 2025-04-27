"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

import { AssignRiderModal, Rider } from "./AssignRiderModal";
import { StatusDropdown, RequestStatus } from "./StatusDropdown";

export type EmergencyRequest = {
  userId: string;
  location: string;
  type: "Accident" | "Breakdown" | "Fuel Shortage";
  notes?: string;
  timestamp: string;
  status?: RequestStatus;
  assignedRiderId?: string;
  assignedRiderName?: string;
};

const typeLabels: Record<EmergencyRequest["type"], string> = {
  Accident: "تصادف",
  Breakdown: "خرابی",
  "Fuel Shortage": "اتمام بنزین",
};

const filters = [
  { value: "all", label: "همه درخواست‌ها" },
  { value: "Accident", label: "فقط تصادف‌ها" },
  { value: "Breakdown", label: "فقط خرابی‌ها" },
  { value: "Fuel Shortage", label: "فقط اتمام بنزین" },
];

function formatDate(iso: string) {
  // For now, return ISO. Jalali can be added with a package if needed.
  return new Date(iso).toLocaleString("fa-IR");
}

export const AdminEmergencyRequestList: React.FC = () => {
  const { socket } = useSocket("ws://localhost:3001");
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRequestIdx, setSelectedRequestIdx] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Static mock riders
  const riders: Rider[] = [
    { id: "r1", name: "رضا محمدی" },
    { id: "r2", name: "علی ناصری" },
    { id: "r3", name: "سعید کریمی" },
    { id: "r4", name: "محمد حسینی" },
  ];

  useEffect(() => {
    if (!socket) return;
    const handler = (data: EmergencyRequest) => {
      setRequests((prev) => [
        {
          ...data,
          status: "در انتظار",
        },
        ...prev,
      ]);
    };
    socket.on("new-emergency-request", handler);
    return () => {
      socket.off("new-emergency-request", handler);
    };
  }, [socket]);

  const handleAssignRider = (reqIdx: number) => {
    setSelectedRequestIdx(reqIdx);
    setModalOpen(true);
  };

  const onAssign = (rider: Rider) => {
    if (selectedRequestIdx === null) return;
    setRequests((prev) => {
      const updated = [...prev];
      updated[selectedRequestIdx] = {
        ...updated[selectedRequestIdx],
        assignedRiderId: rider.id,
        assignedRiderName: rider.name,
        status: "در حال رسیدگی",
      };
      return updated;
    });
    setModalOpen(false);
    setToast({ type: "success", message: `موتورسوار با موفقیت اختصاص یافت.` });
    setTimeout(() => setToast(null), 2500);
    // Emit WebSocket event
    if (socket) {
      const req = requests[selectedRequestIdx];
      socket.emit("request-assigned", {
        requestId: req.timestamp + req.userId,
        assignedRiderId: rider.id,
        assignedRiderName: rider.name,
      });
    }
  };

  const handleStatusChange = (idx: number, newStatus: RequestStatus) => {
    setRequests((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status: newStatus };
      return updated;
    });
    setToast({ type: "success", message: `وضعیت درخواست تغییر کرد.` });
    setTimeout(() => setToast(null), 2000);
    // Optionally emit status update event
    if (socket) {
      const req = requests[idx];
      socket.emit("request-status-updated", {
        requestId: req.timestamp + req.userId,
        status: newStatus,
      });
    }
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((r) => r.type === filter);

  return (
    <div dir="rtl" className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-2xl font-bold text-right">درخواست‌های اضطراری دریافتی</h2>
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 text-right"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      {filteredRequests.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">هیچ درخواست اضطراری ثبت نشده است.</div>
      ) : (
        <ul className="flex flex-col gap-4">
          {filteredRequests.map((req, idx) => (
            <li
              key={req.timestamp + req.userId + idx}
              className="bg-white border rounded shadow p-4 flex flex-col text-right relative"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold">مکان حادثه:</span> {req.location}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold">نوع حادثه:</span> {typeLabels[req.type]}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold">وضعیت:</span>
                  <StatusDropdown
                    status={req.status || "در انتظار"}
                    onChange={(newStatus) => handleStatusChange(idx, newStatus)}
                  />
                </div>
              </div>
              {req.notes && <div className="mb-1"><span className="font-semibold">توضیحات اضافه:</span> {req.notes}</div>}
              <div className="mb-1"><span className="font-semibold">شناسه کاربر:</span> {req.userId}</div>
              <div className="mb-1"><span className="font-semibold">زمان ثبت درخواست:</span> {formatDate(req.timestamp)}</div>
              {req.assignedRiderName ? (
                <div className="mt-2"><span className="font-semibold">موتورسوار اختصاص یافته:</span> {req.assignedRiderName}</div>
              ) : (
                <button
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                  onClick={() => handleAssignRider(idx)}
                >اختصاص موتورسوار</button>
              )}
            </li>
          ))}
        </ul>
      )}
      <AssignRiderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAssign={onAssign}
        riders={riders}
      />
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};
