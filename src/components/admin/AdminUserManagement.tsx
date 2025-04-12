import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAuth, User, VerificationStatus } from "../../context/AuthContext";
import AdminService from "../../services/AdminService";
import PositionAssignment from "../barangay/PositionAssignment";
import VerificationStatusComponent from "../barangay/VerificationStatusComponent";
import {
  FiUsers,
  FiMoreVertical,
  FiUserCheck,
  FiUserX,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiSearch,
  FiX,
  FiTrash2,
  FiShield,
  FiShieldOff,
  FiClock,
  FiHelpCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const AdminUserManagement: React.FC = () => {
  const { authState } = useAuth();
  // Basic state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [showBatchActions, setShowBatchActions] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(4);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<
    "all" | "admin" | "user" | "verified" | "unverified" | "pending"
  >("all");

  // Show batch actions when users are selected
  useEffect(() => {
    setShowBatchActions(selectedUsers.length > 0);
  }, [selectedUsers]);

  // Fetch users data
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

  // Filter users based on search and filter criteria
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Apply user type filter
      if (filterType === "admin" && !user.admin) return false;
      if (filterType === "user" && user.admin) return false;
      if (
        filterType === "verified" &&
        user.verification_status !== VerificationStatus.VERIFIED
      )
        return false;
      if (
        filterType === "unverified" &&
        user.verification_status !== VerificationStatus.UNVERIFIED
      )
        return false;
      if (
        filterType === "pending" &&
        user.verification_status !== VerificationStatus.PENDING
      )
        return false;

      // Apply search term filter
      if (searchTerm.trim() === "") return true;

      const searchLower = searchTerm.toLowerCase();
      const firstNameLower = (user.first_name || "").toLowerCase();
      const lastNameLower = (user.last_name || "").toLowerCase();
      const fullName = `${user.first_name || ""} ${
        user.last_name || ""
      }`.toLowerCase();

      return (
        user.email.toLowerCase().includes(searchLower) ||
        user.email.split("@")[0].toLowerCase().includes(searchLower) ||
        firstNameLower.includes(searchLower) ||
        lastNameLower.includes(searchLower) ||
        fullName.includes(searchLower)
      );
    });
  }, [users, filterType, searchTerm]);

  // Update pagination when filters change
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredUsers.length / usersPerPage)));

    // Reset to first page if current page would be out of range
    if (
      currentPage > 1 &&
      filteredUsers.length <= (currentPage - 1) * usersPerPage
    ) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length, usersPerPage, currentPage]);

  // Get current users for the page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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

  // Handle user updates (position assignment, verification status)
  const handleUserUpdate = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleBatchAddAdmin = async () => {
    try {
      // Filter out current user to prevent self-modification
      const eligibleUsers = selectedUsers.filter(
        (id) => id !== authState.user?.id
      );

      if (eligibleUsers.length === 0) {
        showErrorToast("Cannot modify your own admin status");
        return;
      }

      // In a real implementation, this would be a batch API call
      for (const userId of eligibleUsers) {
        const user = users.find((u) => u.id === userId);
        if (user && !user.admin) {
          await AdminService.toggleAdminStatus(userId);
        }
      }

      // Refresh user data
      const userData = await AdminService.getAllUsers();
      setUsers(userData);

      setSelectedUsers([]);
      setSelectAll(false);
      showSuccessToast(
        `Admin privileges granted to ${eligibleUsers.length} users`
      );
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Failed to update admin status"
      );
    }
  };

  const handleBatchRemoveAdmin = async () => {
    try {
      // Filter out current user to prevent self-modification
      const eligibleUsers = selectedUsers.filter(
        (id) => id !== authState.user?.id
      );

      if (eligibleUsers.length === 0) {
        showErrorToast("Cannot modify your own admin status");
        return;
      }

      // In a real implementation, this would be a batch API call
      for (const userId of eligibleUsers) {
        const user = users.find((u) => u.id === userId);
        if (user && user.admin) {
          await AdminService.toggleAdminStatus(userId);
        }
      }

      // Refresh user data
      const userData = await AdminService.getAllUsers();
      setUsers(userData);

      setSelectedUsers([]);
      setSelectAll(false);
      showSuccessToast(
        `Admin privileges removed from ${eligibleUsers.length} users`
      );
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Failed to update admin status"
      );
    }
  };

  const handleBatchDelete = async () => {
    try {
      // Filter out current user to prevent self-deletion
      const eligibleUsers = selectedUsers.filter(
        (id) => id !== authState.user?.id
      );

      if (eligibleUsers.length === 0) {
        showErrorToast("Cannot delete your own account");
        return;
      }

      // Simulate batch deletion (in a real app, this would call an API)
      const updatedUsers = users.filter(
        (user) => !eligibleUsers.includes(user.id)
      );
      setUsers(updatedUsers);

      setSelectedUsers([]);
      setSelectAll(false);
      showSuccessToast(`${eligibleUsers.length} users deleted successfully`);
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Failed to delete users"
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

  // Generate page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Calculate the range of page numbers to display
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    // Adjust start page if end page is maxed out
    if (endPage === totalPages && totalPages > 1) {
      startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Check if current user can verify accounts
  const canVerifyAccounts = () => {
    return authState.user?.admin || authState.user?.can_verify_accounts;
  };

  // Get full name of user
  const getFullName = (user: User) => {
    const nameParts = [
      user.first_name,
      user.middle_name ? user.middle_name.charAt(0) + "." : "",
      user.last_name,
      user.name_extension,
    ].filter(Boolean);

    return nameParts.join(" ") || user.email.split("@")[0];
  };

  // Mobile view for each user
  const renderMobileUserCard = (user: User) => (
    <div
      key={user.id}
      className="bg-white border border-gray-200 rounded-md mb-3 overflow-hidden shadow-sm"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-3 overflow-hidden">
              <span className="text-white font-medium">
                {(user.first_name
                  ? user.first_name.charAt(0)
                  : user.email.charAt(0)
                ).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900 truncate max-w-xs">
                {getFullName(user)}
              </div>
              <div className="text-gray-500 text-sm truncate max-w-xs">
                {user.email}
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            className="rounded"
            checked={selectedUsers.includes(user.id)}
            onChange={() => toggleSelectUser(user.id)}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Access:</span>
            {user.admin ? (
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                Admin
              </span>
            ) : (
              <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                User
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Position:</span>
            <PositionAssignment user={user} onUpdate={handleUserUpdate} />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Verification:</span>
            <VerificationStatusComponent
              user={user}
              canVerify={canVerifyAccounts()}
              onUpdate={handleUserUpdate}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handleToggleAdmin(user.id)}
            disabled={user.id === authState.user?.id}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              user.id === authState.user?.id
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : user.admin
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {user.admin ? "Remove Admin" : "Make Admin"}
          </button>
          <button className="text-gray-400 hover:text-gray-600 p-2">
            <FiMoreVertical />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col space-y-4 px-4 sm:px-0">
      <div className="flex items-center mb-4 sm:mb-6">
        <FiUsers className="text-xl sm:text-2xl mr-2 sm:mr-3" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          User Management
        </h1>
      </div>

      {/* Batch Actions Bar - Only visible when users are selected */}
      {showBatchActions && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            {selectedUsers.length} users selected
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleBatchAddAdmin}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
            >
              <FiShield className="mr-1" size={14} />
              <span>Make Admin</span>
            </button>
            <button
              onClick={handleBatchRemoveAdmin}
              className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
            >
              <FiShieldOff className="mr-1" size={14} />
              <span>Remove Admin</span>
            </button>
            <button
              onClick={handleBatchDelete}
              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="mr-1" size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop search and filter */}
      <div className="hidden sm:flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-700 mr-2">Filter:</div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                filterType === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("admin")}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                filterType === "admin"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setFilterType("user")}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                filterType === "user"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Regular
            </button>
            <button
              onClick={() => setFilterType("verified")}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                filterType === "verified"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiCheckCircle className="inline mr-1 text-green-500" />
              Verified
            </button>
            <button
              onClick={() => setFilterType("pending")}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                filterType === "pending"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiClock className="inline mr-1 text-yellow-500" />
              Pending
            </button>
          </div>
        </div>

        <div className="relative w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Mobile filter and search */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded-md text-sm"
          >
            <FiFilter className="mr-2" />
            Filter
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-md text-sm"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-3 p-4 bg-white border border-gray-200 rounded-md">
            <div className="text-sm mb-2 font-medium">User type</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === "all"
                    ? "bg-black text-white"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("admin")}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === "admin"
                    ? "bg-black text-white"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setFilterType("user")}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === "user"
                    ? "bg-black text-white"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                Regular
              </button>
              <button
                onClick={() => setFilterType("verified")}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === "verified"
                    ? "bg-black text-white"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                <FiCheckCircle className="inline mr-1 text-green-500" />
                Verified
              </button>
              <button
                onClick={() => setFilterType("pending")}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterType === "pending"
                    ? "bg-black text-white"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                <FiClock className="inline mr-1 text-yellow-500" />
                Pending
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 flex flex-col"
      >
        <div className="flex flex-col">
          {/* Desktop table header - hidden on mobile */}
          <div className="hidden sm:block w-full">
            <table className="w-full table-auto">
              <colgroup>
                <col style={{ width: "4%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "29%" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-500">
                  <th className="px-6 py-3 text-left font-medium align-middle">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left font-medium">User</th>
                  <th className="px-6 py-3 text-left font-medium">Access</th>
                  <th className="px-6 py-3 text-left font-medium">Position</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Mobile view bulk select - only shown on small screens */}
          <div className="sm:hidden flex items-center border-b border-gray-200 p-3">
            <input
              type="checkbox"
              className="rounded mr-3"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <span className="text-sm text-gray-500">
              {selectAll ? "Deselect all" : "Select all"}
            </span>

            {/* Mobile batch actions */}
            {showBatchActions && (
              <div className="flex ml-auto space-x-2">
                <button
                  onClick={handleBatchAddAdmin}
                  className="p-1 bg-green-600 text-white rounded-md text-sm"
                  title="Make Admin"
                >
                  <FiShield size={16} />
                </button>
                <button
                  onClick={handleBatchRemoveAdmin}
                  className="p-1 bg-gray-600 text-white rounded-md text-sm"
                  title="Remove Admin"
                >
                  <FiShieldOff size={16} />
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="p-1 bg-red-600 text-white rounded-md text-sm"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Table body */}
          <div className="overflow-y-auto">
            {/* Mobile cards view */}
            <div className="sm:hidden space-y-3 p-4">
              {paginatedUsers.map(renderMobileUserCard)}
            </div>

            {/* Desktop table view - hidden on mobile */}
            <table className="hidden sm:table w-full table-auto">
              <colgroup>
                <col style={{ width: "4%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "29%" }} />
              </colgroup>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 align-middle">
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
                            {(user.first_name
                              ? user.first_name.charAt(0)
                              : user.email.charAt(0)
                            ).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {getFullName(user)}
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
                          <span className="text-green-700">Admin</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FiUserX className="text-gray-500 mr-2" />
                          <span className="text-gray-700">User</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <PositionAssignment
                        user={user}
                        onUpdate={handleUserUpdate}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <VerificationStatusComponent
                        user={user}
                        canVerify={canVerifyAccounts()}
                        onUpdate={handleUserUpdate}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div style={{ width: "128px" }}>
                          <button
                            onClick={() => handleToggleAdmin(user.id)}
                            disabled={user.id === authState.user?.id}
                            className={`w-full px-3 py-1 rounded-md text-sm font-medium transition-colors text-center ${
                              user.id === authState.user?.id
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : user.admin
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
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

        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200 text-sm">
          <div className="text-gray-500">
            Showing {indexOfFirstUser + 1}-
            {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
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

            <div className="flex space-x-1">
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
            </div>

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

export default AdminUserManagement;
