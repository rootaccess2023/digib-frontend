import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiBox, FiHome, FiLogOut, FiUsers, FiMenu, FiX } from "react-icons/fi";

const MainLayout = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar for mobile and desktop */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform md:translate-x-0 md:static md:inset-0 md:h-auto border-r border-gray-200 bg-white text-gray-800 flex flex-col`}
      >
        {/* Logo section */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-md bg-black flex items-center justify-center mr-2">
              <FiBox className="text-white text-sm md:text-base" />
            </div>
            <span className="text-lg md:text-xl font-bold">App Dashboard</span>
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={closeSidebar}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 pt-2 p-4 overflow-y-auto">
          {/* Navigation links */}
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FiHome className="text-lg md:text-xl" />
              <span className="text-sm md:text-base">Dashboard</span>
            </NavLink>

            {/* Admin section - only visible to admins */}
            {authState.user?.admin && (
              <>
                <div className="pt-4 pb-1 px-1 text-xs uppercase text-gray-500 font-medium">
                  Admin
                </div>
                <NavLink
                  to="/admin-user-management"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <FiUsers className="text-lg md:text-xl" />
                  <span className="text-sm md:text-base">User Management</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Logout button at bottom */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-md transition-colors"
          >
            <FiLogOut className="text-lg md:text-xl" />
            <span className="text-sm md:text-base">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with menu button */}
        <div className="md:hidden border-b border-gray-200 bg-white p-4 flex items-center">
          <button
            className="text-gray-500 hover:text-gray-700 mr-3"
            onClick={toggleSidebar}
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-md bg-black flex items-center justify-center mr-2">
              <FiBox className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold">App Dashboard</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="h-full p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
