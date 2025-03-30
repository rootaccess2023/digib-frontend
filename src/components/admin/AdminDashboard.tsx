import React, { useEffect, useState } from "react";
import { useAuth, User } from "../../context/AuthContext";
import AdminService from "../../services/AdminService";
import { FiUsers, FiMoreVertical, FiUserCheck, FiUserX } from "react-icons/fi";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const AdminDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

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
        showErrorToast("You cannot remove your own admin privileges");
        return;
      }

      const updatedUser = await AdminService.toggleAdminStatus(userId);

      // Update the users list with the updated user
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      showSuccessToast(`Admin status updated for ${updatedUser.email}`);
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Failed to update admin status"
      );
    }
  };

  const toggleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <FiUsers className="text-2xl mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      </div>

      <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-500">
              <th className="px-6 py-3 text-left font-medium">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left font-medium">User</th>
              <th className="px-6 py-3 text-left font-medium">Access</th>
              <th className="px-6 py-3 text-left font-medium">Last active</th>
              <th className="px-6 py-3 text-left font-medium">Date added</th>
              <th className="px-6 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelectUser(user.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-3 overflow-hidden">
                      <span className="text-white font-medium">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.email.split("@")[0]}
                      </div>
                      <div className="text-gray-500 text-sm">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.admin ? (
                    <div className="flex items-center">
                      <FiUserCheck className="text-green-500 mr-2" />
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Admin
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FiUserX className="text-gray-500 mr-2" />
                      <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        User
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500">Mar 4, 2024</td>
                <td className="px-6 py-4 text-gray-500">Jul 4, 2022</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleAdmin(user.id)}
                      disabled={user.id === authState.user?.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        user.id === authState.user?.id
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : user.admin
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {user.admin ? "Remove Admin" : "Make Admin"}
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <FiMoreVertical />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {users.length} users
            {selectedUsers.length > 0 && ` (${selectedUsers.length} selected)`}
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-black text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
