import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Simple icon components (you can replace these with any icon library like lucide-react)
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const AdminIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v6.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L14 12.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const MainLayout: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 flex-1">
          <h2 className="text-2xl font-bold mb-6 text-center">App Dashboard</h2>

          {/* User info section */}
          <div className="mb-6 pb-4 border-b border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {authState.user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm truncate">{authState.user?.email}</p>
                <p className="text-xs text-gray-400">
                  {authState.user?.admin ? "Administrator" : "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
            >
              <DashboardIcon />
              <span>Dashboard</span>
            </NavLink>

            {/* Admin section - only visible to admins */}
            {authState.user?.admin && (
              <>
                <div className="pt-4 pb-1 px-4 text-xs uppercase text-gray-500 font-semibold">
                  Admin
                </div>
                <NavLink
                  to="/admin-portal"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2 rounded transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`
                  }
                >
                  <AdminIcon />
                  <span>User Management</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Logout button at bottom */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
