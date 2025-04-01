import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiKey, FiUserCheck, FiHome } from "react-icons/fi";

const Dashboard: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-6">
      <div className="flex items-center mb-4 sm:mb-6">
        <FiHome className="text-xl sm:text-2xl mr-2 sm:mr-3" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
      </div>

      <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 mb-4 sm:mb-6">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg font-medium text-gray-800">
            User Information
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row mb-4 sm:mb-6">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-600 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 mx-auto sm:mx-0">
              <span className="text-xl sm:text-2xl font-semibold text-white">
                {authState.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                {authState.user?.email?.split("@")[0]}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base break-all sm:break-normal">
                {authState.user?.email}
              </p>
              <div className="mt-2 flex justify-center sm:justify-start">
                {authState.user?.admin ? (
                  <div className="flex items-center">
                    <FiUserCheck className="text-green-500 mr-2" />
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Administrator
                    </span>
                  </div>
                ) : (
                  <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    User
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-md p-3 sm:p-4">
              <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                <FiMail className="mr-2 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">
                  Email Address
                </span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base break-all">
                {authState.user?.email}
              </p>
            </div>

            <div className="bg-gray-50 rounded-md p-3 sm:p-4">
              <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                <FiKey className="mr-2 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">
                  User ID
                </span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base break-all">
                {authState.user?.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {authState.user?.admin && (
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-800">
              Admin Quick Links
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            <a
              href="/admin-portal"
              className="inline-flex items-center bg-black text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
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
