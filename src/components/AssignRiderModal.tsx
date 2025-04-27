"use client";
import React, { useState } from "react";

export interface Rider {
  id: string;
  name: string;
}

interface AssignRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (rider: Rider) => void;
  riders: Rider[];
}

export const AssignRiderModal: React.FC<AssignRiderModalProps> = ({ isOpen, onClose, onAssign, riders }) => {
  const [selectedRiderId, setSelectedRiderId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAssign = () => {
    const rider = riders.find((r) => r.id === selectedRiderId);
    if (!rider) {
      setError("لطفاً یک موتورسوار را انتخاب کنید.");
      return;
    }
    setError("");
    onAssign(rider);
    setSelectedRiderId("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6" dir="rtl">
        <h3 className="text-xl font-bold mb-4 text-right">اختصاص موتورسوار</h3>
        <select
          className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring focus:ring-blue-200 text-right"
          value={selectedRiderId}
          onChange={(e) => setSelectedRiderId(e.target.value)}
        >
          <option value="">انتخاب موتورسوار...</option>
          {riders.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
        <div className="flex gap-2 mt-4 justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={() => { setSelectedRiderId(""); setError(""); onClose(); }}
          >انصراف</button>
          <button
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleAssign}
          >تأیید</button>
        </div>
      </div>
    </div>
  );
};
