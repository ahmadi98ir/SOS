"use client";
import React from "react";

import { useSocket } from "../../hooks/useSocket";
import { SocketStatus } from "../../components/SocketStatus";
import { NotificationsPanel } from "../../components/NotificationsPanel";
import { AdminAddNotificationForm } from "../../components/AdminAddNotificationForm";

const DashboardPage = () => {
  const { connected } = useSocket("ws://localhost:3001");
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <SocketStatus connected={connected} />
      </div>
      <div className="mb-8">
        <NotificationsPanel />
      </div>
      <div className="mb-8">
        <AdminAddNotificationForm />
      </div>
      <p className="text-gray-600">Here you can view request statuses, service metrics, and analytics.</p>
      {/* TODO: Add real-time status, charts, and metrics here */}
    </div>
  );
};

export default DashboardPage;
