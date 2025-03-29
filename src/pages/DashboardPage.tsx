// src/components/Dashboard.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Welcome to the Dashboard
      </h1>

      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <h2 className="text-lg font-semibold mb-2">User Information</h2>
        <p>
          <strong>Email:</strong> {authState.user?.email}
        </p>
        <p>
          <strong>User ID:</strong> {authState.user?.id}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          {authState.user?.admin ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Admin
            </span>
          ) : (
            <span>User</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
