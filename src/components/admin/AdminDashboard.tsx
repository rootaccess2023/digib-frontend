import React, { useEffect, useState, useRef } from "react";
import { useAuth, User } from "../../context/AuthContext";
import AdminService from "../../services/AdminService";
import {
  FiUsers,
  FiMoreVertical,
  FiUserCheck,
  FiUserX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const AdminDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [tableHeight, setTableHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await AdminService.getAllUsers();
        setUsers(userData);
        setTotalPages(Math.ceil(userData.length / usersPerPage));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
        setLoading(false);
      }
    };

    if (authState.isAuthenticated && authState.user?.admin) {
      fetchUsers();
    }
  }, [authState.isAuthenticated, authState.user, usersPerPage]);

  // Calculate and set the available height for the table
  useEffect(() => {
    const updateTableHeight = () => {
      if (containerRef.current) {
        // Get container's top position
        const containerTop = containerRef.current.getBoundingClientRect().top;
        // Calculate available height (viewport height - container top - pagination height - some padding)
        const availableHeight = window.innerHeight - containerTop - 60 - 20; // 60px for pagination, 20px for padding
        setTableHeight(availableHeight);
      }
    };

    // Initial calculation
    updateTableHeight();

    // Update on window resize
    window.addEventListener("resize", updateTableHeight);

    // Cleanup
    return () => window.removeEventListener("resize", updateTableHeight);
  }, []);

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
      const currentPageUserIds = paginatedUsers.map((user) => user.id);
      setSelectedUsers(currentPageUserIds);
    }
    setSelectAll(!selectAll);
  };

  // Function to change the page
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSelectAll(false);
      setSelectedUsers([]);
    }
  };

  // Get current users for the page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Generate page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Calculate the range of page numbers to display
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust start page if end page is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
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
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center mb-6">
        <FiUsers className="text-2xl mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      </div>

      <div
        ref={containerRef}
        className="flex flex-col flex-1 justify-between bg-white rounded-md overflow-hidden shadow-sm border border-gray-200"
        style={{ height: `calc(100vh - 100px)` }} // Fallback height
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Use a table layout that maintains column widths */}
          <div className="w-full">
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: "5%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
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
                  <th className="px-6 py-3 text-left font-medium">
                    Last active
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    Date added
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Table body - scrollable */}
          <div
            className="overflow-y-auto flex-1"
            style={{ maxHeight: tableHeight ? `${tableHeight}px` : "auto" }}
          >
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: "5%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <tbody>
                {paginatedUsers.map((user) => (
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
                          <div className="text-gray-500 text-sm">
                            {user.email}
                          </div>
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
                      <div className="flex items-center">
                        <div style={{ width: "128px" }}>
                          <button
                            onClick={() => handleToggleAdmin(user.id)}
                            disabled={user.id === authState.user?.id}
                            className={`w-full px-3 py-1 rounded-full text-sm font-medium transition-colors text-center ${
                              user.id === authState.user?.id
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : user.admin
                                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                : "bg-black text-white hover:bg-gray-800"
                            }`}
                          >
                            {user.admin ? "Remove Admin" : "Make Admin"}
                          </button>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 p-1 ml-2">
                          <FiMoreVertical />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstUser + 1}-
            {Math.min(indexOfLastUser, users.length)} of {users.length} users
            {selectedUsers.length > 0 && ` (${selectedUsers.length} selected)`}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1 rounded ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiChevronLeft />
            </button>

            {renderPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-black text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1 rounded ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
