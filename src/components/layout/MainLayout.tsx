import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiBox,
  FiHome,
  FiLogOut,
  FiUsers,
  FiMenu,
  FiX,
  FiPieChart,
  FiCheckCircle,
  FiUser,
  FiShield,
  FiFileText,
} from "react-icons/fi";

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

  // Check if user is a barangay official
  const isBarangayOfficial = () => {
    return (
      authState.user?.admin ||
      authState.user?.can_verify_accounts ||
      authState.user?.barangay_position !== "none"
    );
  };

  // Get the position display name
  const getPositionName = () => {
    if (
      !authState.user?.barangay_position ||
      authState.user?.barangay_position === "none"
    ) {
      return null;
    }

    const positionMap: { [key: string]: string } = {
      barangay_captain: "Barangay Captain",
      barangay_kagawad: "Barangay Kagawad",
      sk_chairperson: "SK Chairperson",
      barangay_secretary: "Barangay Secretary",
      barangay_treasurer: "Barangay Treasurer",
    };

    return positionMap[authState.user.barangay_position];
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
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
        } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform md:translate-x-0 md:static md:inset-0 md:h-screen flex-shrink-0 border-r border-gray-200 bg-white text-gray-800 flex flex-col`}
      >
        {/* Logo section */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-md bg-black flex items-center justify-center mr-2">
              <FiBox className="text-white text-sm md:text-base" />
            </div>
            <span className="text-lg md:text-xl font-bold">
              Digital Barangay
            </span>
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={closeSidebar}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* User info section */}
        {authState.user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-white font-medium">
                  {(
                    authState.user.first_name?.charAt(0) ||
                    authState.user.email?.charAt(0)
                  ).toUpperCase()}
                </span>
              </div>
              <div className="truncate">
                <div className="font-medium truncate">
                  {authState.user.first_name
                    ? `${authState.user.first_name} ${
                        authState.user.last_name || ""
                      }`
                    : authState.user.email?.split("@")[0]}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {authState.user.email}
                </div>
              </div>
            </div>

            {/* Show position if user has one */}
            {getPositionName() && (
              <div className="bg-blue-50 border border-blue-100 rounded-md px-2 py-1 mt-2 text-xs text-blue-700 font-medium flex items-center">
                <FiShield className="mr-1" />
                {getPositionName()}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto pt-2 p-4">
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

            {/* Barangay Officials Section - only visible to officials */}
            {isBarangayOfficial() && (
              <>
                <div className="pt-4 pb-1 px-1 text-xs uppercase text-gray-500 font-medium">
                  Barangay Management
                </div>

                {authState.user?.can_verify_accounts && (
                  <NavLink
                    to="/verification-management"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <FiCheckCircle className="text-lg md:text-xl" />
                    <span className="text-sm md:text-base">
                      Verify Accounts
                    </span>
                  </NavLink>
                )}

                <NavLink
                  to="/residents"
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
                  <span className="text-sm md:text-base">Residents</span>
                </NavLink>

                <NavLink
                  to="/documents"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <FiFileText className="text-lg md:text-xl" />
                  <span className="text-sm md:text-base">Documents</span>
                </NavLink>
              </>
            )}

            {/* Admin section - only visible to admins */}
            {authState.user?.admin && (
              <>
                <div className="pt-4 pb-1 px-1 text-xs uppercase text-gray-500 font-medium">
                  Admin
                </div>

                <NavLink
                  to="/admin-dashboard"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <FiPieChart className="text-lg md:text-xl" />
                  <span className="text-sm md:text-base">Admin Dashboard</span>
                </NavLink>

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
                  <FiUser className="text-lg md:text-xl" />
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
        <div className="md:hidden sticky top-0 z-10 border-b border-gray-200 bg-white p-4 flex items-center">
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
            <span className="text-lg font-bold">Digital Barangay</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
