"use client";
import React from "react";

export type RequestStatus = "در انتظار" | "در حال رسیدگی" | "تکمیل شده" | "لغو شده";

interface StatusDropdownProps {
  status: RequestStatus;
  onChange: (newStatus: RequestStatus) => void;
}

const statuses: RequestStatus[] = [
  "در انتظار",
  "در حال رسیدگی",
  "تکمیل شده",
  "لغو شده",
];

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ status, onChange }) => {
  return (
    <select
      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200 text-right"
      value={status}
      onChange={e => onChange(e.target.value as RequestStatus)}
      dir="rtl"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
};
