import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiKey, FiUserCheck, FiHome } from "react-icons/fi";

const Dashboard: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <FiHome className="text-2xl mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">
            User Information
          </h2>
        </div>

        <div className="p-6">
          <div className="flex mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center mr-4">
              <span className="text-2xl font-semibold text-white">
                {authState.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                {authState.user?.email?.split("@")[0]}
              </h3>
              <p className="text-gray-500">{authState.user?.email}</p>
              <div className="mt-2">
                {authState.user?.admin ? (
                  <div className="flex items-center">
                    <FiUserCheck className="text-green-500 mr-2" />
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Administrator
                    </span>
                  </div>
                ) : (
                  <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    User
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center text-gray-700 mb-2">
                <FiMail className="mr-2" />
                <span className="font-medium">Email Address</span>
              </div>
              <p className="text-gray-900">{authState.user?.email}</p>
            </div>

            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center text-gray-700 mb-2">
                <FiKey className="mr-2" />
                <span className="font-medium">User ID</span>
              </div>
              <p className="text-gray-900">{authState.user?.id}</p>
            </div>
          </div>
        </div>
      </div>

      {authState.user?.admin && (
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">
              Admin Quick Links
            </h2>
          </div>

          <div className="p-6">
            <a
              href="/admin-portal"
              className="inline-flex items-center bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <FiUser className="mr-2" />
              User Management
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
