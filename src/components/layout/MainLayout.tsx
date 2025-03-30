import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiBox, FiHome, FiLogOut, FiUsers } from "react-icons/fi";

const MainLayout = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Updated Sidebar with original functionality but new styles */}
      <div className="w-64 border-r border-gray-200 bg-white text-gray-800 flex flex-col">
        {/* Logo section */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-black flex items-center justify-center mr-2">
              <FiBox className="text-white" />
            </div>
            <span className="text-xl font-bold">App Dashboard</span>
          </div>
        </div>

        <div className="flex-1 pt-2 p-4">
          {/* Navigation links - preserving original links but applying new styles */}
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FiHome className="text-xl" />
              <span>Dashboard</span>
            </NavLink>

            {/* Admin section - only visible to admins */}
            {authState.user?.admin && (
              <>
                <div className="pt-4 pb-1 px-1 text-xs uppercase text-gray-500 font-medium">
                  Admin
                </div>
                <NavLink
                  to="/admin-portal"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <FiUsers className="text-xl" />
                  <span>User Management</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Logout button at bottom with updated styles */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-md transition-colors"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="h-screen p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
