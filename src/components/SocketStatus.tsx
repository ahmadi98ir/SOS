"use client";
import React from "react";

interface SocketStatusProps {
  connected: boolean;
}

export function SocketStatus({ connected }: SocketStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block w-3 h-3 rounded-full border border-gray-300 ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
        title={connected ? "Connected" : "Disconnected"}
      />
      <span className="text-xs text-gray-600">
        {connected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
