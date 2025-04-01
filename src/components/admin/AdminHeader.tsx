import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  const navigateToAdminDashboard = () => {
    navigate("/admin-portal");
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-6">Admin Portal</h1>
          <nav className="flex space-x-4">
            <button
              onClick={navigateToAdminDashboard}
              className="hover:text-blue-300 transition-colors"
            >
              Admin Dashboard
            </button>
            <button
              onClick={navigateToDashboard}
              className="hover:text-blue-300 transition-colors"
            >
              User Dashboard
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
