"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useSocket } from "../hooks/useSocket";

const emergencyTypes = [
  "Accident",
  "Breakdown",
  "Fuel Shortage",
];

const EmergencyRequestSchema = z.object({
  location: z.string().min(1, "Location is required"),
  type: z.enum(["Accident", "Breakdown", "Fuel Shortage"]),
  notes: z.string().optional(),
});

type EmergencyRequestFormValues = z.infer<typeof EmergencyRequestSchema>;

interface EmergencyRequestSummaryProps {
  request: EmergencyRequestPayload;
}

interface EmergencyRequestPayload {
  userId: string;
  location: string;
  type: string;
  notes?: string;
  timestamp: string;
}

export function EmergencyRequestForm() {
  const user = useSelector((state: RootState) => state.auth);
  const { socket } = useSocket("ws://localhost:3001");
  const [submittedRequest, setSubmittedRequest] = useState<EmergencyRequestPayload | null>(null);
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmergencyRequestFormValues>({
    resolver: zodResolver(EmergencyRequestSchema),
  });

  // Mocked API mutation
  const mutation = useMutation({
    mutationFn: async (data: EmergencyRequestFormValues) => {
      await new Promise((res) => setTimeout(res, 1000)); // Simulate network delay
      return data;
    },
    onSuccess: (data) => {
      const payload: EmergencyRequestPayload = {
        userId: user.userId,
        location: data.location,
        type: data.type,
        notes: data.notes,
        timestamp: new Date().toISOString(),
      };
      setSubmittedRequest(payload);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      if (socket) {
        socket.emit("new-emergency-request", payload);
      }
      reset();
    },
  });

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">New Emergency Request</h2>
      <form
        className="bg-white shadow rounded px-6 py-4 flex flex-col gap-4"
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
      >
        <div>
          <label className="block font-medium mb-1">Location *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            {...register("location")}
          />
          {errors.location && (
            <span className="text-red-500 text-xs">{errors.location.message}</span>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Emergency Type *</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            {...register("type")}
            defaultValue=""
          >
            <option value="" disabled>
              Select type
            </option>
            {emergencyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && (
            <span className="text-red-500 text-xs">{errors.type.message}</span>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Additional Notes</label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            rows={3}
            {...register("notes")}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
          Emergency request submitted successfully!
        </div>
      )}
      {submittedRequest && (
        <div className="mt-6 bg-gray-50 border rounded p-4">
          <h3 className="font-semibold mb-2 text-lg">Submitted Request Summary</h3>
          <div className="mb-1"><span className="font-medium">Location:</span> {submittedRequest.location}</div>
          <div className="mb-1"><span className="font-medium">Type:</span> {submittedRequest.type}</div>
          {submittedRequest.notes && (
            <div className="mb-1"><span className="font-medium">Notes:</span> {submittedRequest.notes}</div>
          )}
          <div className="mb-1"><span className="font-medium">Timestamp:</span> {submittedRequest.timestamp}</div>
        </div>
      )}
    </div>
  );
}
