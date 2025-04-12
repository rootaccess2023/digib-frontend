import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiPlus,
  FiRefreshCw,
  FiClock,
  FiCheck,
  FiXCircle,
  FiAlertCircle,
  FiHelpCircle,
} from "react-icons/fi";
import ClearanceService, {
  BarangayClearance,
} from "../../services/ClearanceService";
import { showErrorToast } from "../../utils/toast";
import ClearanceStatusBadge from "./ClearanceStatusBadge";
import ClearanceRequestForm from "./ClearanceRequestForm";
import ClearanceDetails from "./ClearanceDetails";

const UserClearances: React.FC = () => {
  const [clearances, setClearances] = useState<BarangayClearance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedClearance, setSelectedClearance] =
    useState<BarangayClearance | null>(null);

  // Load clearances on component mount
  useEffect(() => {
    fetchClearances();
  }, []);

  // Function to fetch user's clearances
  const fetchClearances = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ClearanceService.getUserClearances();
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

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show the create form
  const handleCreateRequest = () => {
    setSelectedClearance(null);
    setIsCreating(true);
  };

  // Cancel creating request
  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  // View clearance details
  const handleViewClearance = (clearance: BarangayClearance) => {
    setIsCreating(false);
    setSelectedClearance(clearance);
  };

  // Close clearance details
  const handleCloseDetails = () => {
    setSelectedClearance(null);
  };

  // Refresh after changes
  const handleRefreshAfterChange = () => {
    fetchClearances();
    setSelectedClearance(null);
  };

  // If creating a new request, show the form
  if (isCreating) {
    return <ClearanceRequestForm onCancel={handleCancelCreate} />;
  }

  // If viewing details, show the details view
  if (selectedClearance) {
    return (
      <ClearanceDetails
        clearance={selectedClearance}
        onClose={handleCloseDetails}
        onRefresh={handleRefreshAfterChange}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (clearances.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiFileText className="mr-3" />
            Barangay Clearance Requests
          </h1>

          <button
            onClick={handleCreateRequest}
            className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <FiPlus className="mr-2" />
            Request Clearance
          </button>
        </div>

        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center">
            <FiFileText className="text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Clearance Requests Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              You haven't requested any barangay clearances yet. Barangay
              clearances are official documents that certify you are a resident
              of the barangay with good standing.
            </p>
            <button
              onClick={handleCreateRequest}
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <FiPlus className="mr-2" />
              Request Your First Clearance
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiFileText className="mr-3" />
          Barangay Clearance Requests
        </h1>

        <div className="flex space-x-3">
          <button
            onClick={fetchClearances}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>

          <button
            onClick={handleCreateRequest}
            className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <FiPlus className="mr-2" />
            Request Clearance
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex">
          <FiHelpCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="text-blue-800 font-medium mb-1">
              About Barangay Clearance
            </h3>
            <p className="text-blue-700 text-sm">
              A Barangay Clearance is an official document certifying that you
              are a resident in good standing within your barangay. It's
              commonly required for job applications, business permits, legal
              transactions, and more.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {clearances.map((clearance) => (
          <div
            key={clearance.id}
            className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewClearance(clearance)}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg text-gray-900 mb-1">
                    {clearance.purpose}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Reference: {clearance.reference_number || "Pending"}
                  </p>
                </div>

                <ClearanceStatusBadge status={clearance.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Requested on:</p>
                  <p className="font-medium">
                    {formatDate(clearance.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Fee Amount:</p>
                  <p className="font-medium">₱{clearance.fee_amount}</p>
                </div>

                <div>
                  <p className="text-gray-500">Payment Status:</p>
                  <p
                    className={`font-medium ${
                      clearance.fee_paid ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {clearance.fee_paid ? "Paid" : "Unpaid"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {clearance.days_ago === 0
                  ? "Requested today"
                  : clearance.days_ago === 1
                  ? "Requested yesterday"
                  : `Requested ${clearance.days_ago} days ago`}
              </div>

              <div className="text-sm font-medium text-blue-600">
                View Details →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserClearances;
