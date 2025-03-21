// src/components/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuth, User } from "../../context/AuthContext";
import AdminService from "../../services/AdminService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminHeader from "./AdminHeader";

const AdminDashboard: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (
      !authState.loading &&
      (!authState.isAuthenticated || !authState.user?.admin)
    ) {
      toast.error("Admin access required");
      navigate("/dashboard");
    }
  }, [authState.isAuthenticated, authState.loading, authState.user, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await AdminService.getAllUsers();
        setUsers(userData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
        setLoading(false);
      }
    };

    if (authState.isAuthenticated && authState.user?.admin) {
      fetchUsers();
    }
  }, [authState.isAuthenticated, authState.user]);

  const handleToggleAdmin = async (userId: number) => {
    try {
      // Prevent toggling current user's admin status
      if (userId === authState.user?.id) {
        toast.error("You cannot remove your own admin privileges");
        return;
      }

      const updatedUser = await AdminService.toggleAdminStatus(userId);

      // Update the users list with the updated user
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      toast.success(`Admin status updated for ${updatedUser.email}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update admin status"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Admin Dashboard
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">
                      Admin Status
                    </th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="py-2 px-4 border-b">{user.id}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">
                        {user.admin ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            Admin
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                            User
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleToggleAdmin(user.id)}
                          disabled={user.id === authState.user?.id}
                          className={`px-3 py-1 rounded text-white ${
                            user.id === authState.user?.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : user.admin
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {user.admin ? "Revoke Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
