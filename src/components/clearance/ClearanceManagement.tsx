import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiX,
  FiCheck,
  FiXCircle,
  FiAlertTriangle,
  FiActivity,
} from "react-icons/fi";
import ClearanceService, {
  BarangayClearance,
} from "../../services/ClearanceService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import ClearanceStatusBadge from "./ClearanceStatusBadge";
import ClearanceProcessingModal from "./ClearanceProcessingModal";

const ClearanceManagement: React.FC = () => {
  const [clearances, setClearances] = useState<BarangayClearance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedClearance, setSelectedClearance] =
    useState<BarangayClearance | null>(null);

  // Load clearances on component mount and when filter changes
  useEffect(() => {
    fetchClearances();
  }, [filterStatus]);

  // Function to fetch clearances
  const fetchClearances = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ClearanceService.getAllClearances(filterStatus);
      setClearances(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load clearance requests"
      );
      showErrorToast(
        err instanceof Error ? err.message : "Failed to load clearance requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter clearances based on search term
  const filteredClearances = clearances.filter((clearance) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const refNumber = clearance.reference_number?.toLowerCase() || "";
    const purpose = clearance.purpose.toLowerCase();
    const userName = `${clearance.user?.first_name || ""} ${
      clearance.user?.last_name || ""
    }`.toLowerCase();
    const email = clearance.user?.email.toLowerCase() || "";

    return (
      refNumber.includes(searchLower) ||
      purpose.includes(searchLower) ||
      userName.includes(searchLower) ||
      email.includes(searchLower)
    );
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get user full name
  const getUserName = (clearance: BarangayClearance) => {
    if (!clearance.user) return "Unknown";

    if (clearance.user.first_name && clearance.user.last_name) {
      return `${clearance.user.first_name} ${clearance.user.last_name}`;
    }

    return clearance.user.email.split("@")[0];
  };

  // Handle opening the processing modal
  const handleOpenProcessing = (clearance: BarangayClearance) => {
    setSelectedClearance(clearance);
  };

  // Handle closing the processing modal
  const handleCloseProcessing = () => {
    setSelectedClearance(null);
  };

  // Handle refreshing after a status change
  const handleRefreshAfterChange = () => {
    fetchClearances();
    setSelectedClearance(null);
  };

  const getEmptyStateMessage = () => {
    if (filterStatus) {
      return {
        title: `No ${filterStatus} clearance requests`,
        message: `There are no clearance requests with ${filterStatus} status at this time.`,
      };
    }

    return {
      title: "No clearance requests",
      message: "There are no clearance requests at this time.",
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiFileText className="mr-3" />
          Manage Clearance Requests
        </h1>

        <button
          onClick={fetchClearances}
          className="flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-md border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
        {/* Status filter */}
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiFilter className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="w-full flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by reference, name, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm("")}
              >
                <FiX className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          {
            status: "all",
            label: "Total",
            icon: <FiFileText className="text-gray-600" />,
            bgColor: "bg-gray-100",
            textColor: "text-gray-800",
          },
          {
            status: "pending",
            label: "Pending",
            icon: <FiAlertTriangle className="text-yellow-600" />,
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-800",
          },
          {
            status: "processing",
            label: "Processing",
            icon: <FiActivity className="text-blue-600" />,
            bgColor: "bg-blue-50",
            textColor: "text-blue-800",
          },
          {
            status: "approved",
            label: "Approved",
            icon: <FiCheck className="text-green-600" />,
            bgColor: "bg-green-50",
            textColor: "text-green-800",
          },
          {
            status: "rejected",
            label: "Rejected",
            icon: <FiXCircle className="text-red-600" />,
            bgColor: "bg-red-50",
            textColor: "text-red-800",
          },
        ].map((stat) => {
          const count =
            stat.status === "all"
              ? clearances.length
              : clearances.filter((c) => c.status === stat.status).length;

          return (
            <div
              key={stat.status}
              className={`${stat.bgColor} p-4 rounded-md border border-gray-200 flex items-center cursor-pointer hover:shadow-md transition`}
              onClick={() =>
                setFilterStatus(stat.status === "all" ? "" : stat.status)
              }
            >
              <div className="mr-3 text-2xl">{stat.icon}</div>
              <div>
                <div className={`text-2xl font-bold ${stat.textColor}`}>
                  {count}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clearance list */}
      {filteredClearances.length === 0 ? (
        <div className="bg-white rounded-md border border-gray-200 p-8 text-center">
          <FiFileText className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {getEmptyStateMessage().title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {getEmptyStateMessage().message}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reference
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Resident
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Purpose
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClearances.map((clearance) => (
                  <tr key={clearance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {clearance.reference_number || "Pending"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          {(
                            clearance.user?.first_name?.charAt(0) ||
                            clearance.user?.email?.charAt(0) ||
                            "?"
                          ).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getUserName(clearance)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {clearance.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-xs">
                        {clearance.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ClearanceStatusBadge status={clearance.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(clearance.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleOpenProcessing(clearance)}
                        className="font-medium text-blue-600 hover:text-blue-900"
                      >
                        {clearance.status === "pending"
                          ? "Process"
                          : "View / Update"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Processing modal */}
      {selectedClearance && (
        <ClearanceProcessingModal
          clearance={selectedClearance}
          onClose={handleCloseProcessing}
          onRefresh={handleRefreshAfterChange}
        />
      )}
    </div>
  );
};

export default ClearanceManagement;
