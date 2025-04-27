"use client";
import React from "react";

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth);
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="mb-2"><span className="font-semibold">User ID:</span> {user.userId}</div>
        <div className="mb-2"><span className="font-semibold">Name:</span> {user.name}</div>
        <div className="mb-2"><span className="font-semibold">Role:</span> {user.role}</div>
      </div>
      <p className="text-gray-600">Manage your personal data, service history, and preferences here.</p>
    </div>
  );
};

export default ProfilePage;
