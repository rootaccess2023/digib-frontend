import React, { useEffect, useState } from "react";
import { User, VerificationStatus } from "../../context/AuthContext";
import BarangayAdminService from "../../services/BarangayAdminService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiPhone,
  FiInfo,
  FiRefreshCw,
} from "react-icons/fi";

const PendingVerifications: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  // Fetch pending verification requests
  const fetchPendingVerifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await BarangayAdminService.getPendingVerifications();
      setPendingUsers(users);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load pending verifications"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load pending verifications on component mount
  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  // Toggle expanded user details
  const toggleExpandUser = (userId: number) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
    }
  };

  // Handle verification status update
  const handleUpdateVerification = async (
    userId: number,
    status: VerificationStatus
  ) => {
    setProcessingIds([...processingIds, userId]);
    try {
      await BarangayAdminService.updateVerificationStatus(userId, status);

      // Update local state to remove the user from the list
      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));

      showSuccessToast(
        status === VerificationStatus.VERIFIED
          ? "User verified successfully"
          : "User verification rejected"
      );
    } catch (error) {
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Failed to update verification status"
      );
    } finally {
      setProcessingIds(processingIds.filter((id) => id !== userId));
    }
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 p-6 text-center">
        <FiClock className="mx-auto text-5xl text-gray-300 mb-3" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No Pending Verifications
        </h3>
        <p className="text-gray-500 mb-4">
          There are no pending verification requests at this time.
        </p>
        <button
          onClick={fetchPendingVerifications}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded inline-flex items-center"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FiClock className="mr-2" />
          Pending Verifications ({pendingUsers.length})
        </h2>
        <button
          onClick={fetchPendingVerifications}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded inline-flex items-center"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>

      {pendingUsers.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200"
        >
          <div
            className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => toggleExpandUser(user.id)}
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                <span className="text-white font-medium">
                  {(
                    user.first_name?.charAt(0) || user.email.charAt(0)
                  ).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {getFullName(user)}
                </h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium mr-3 flex items-center">
                <FiClock className="mr-1.5" />
                Pending Verification
              </span>
              <button
                className={`text-gray-400 focus:outline-none transform transition-transform ${
                  expandedUserId === user.id ? "rotate-180" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {expandedUserId === user.id && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* User Information */}
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <FiUser className="mr-2" />
                    Personal Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 text-sm">Full Name:</span>
                      <p className="font-medium">{getFullName(user)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">
                        Date of Birth:
                      </span>
                      <p>{formatDate(user.date_of_birth)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Gender:</span>
                      <p className="capitalize">
                        {user.gender || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">
                        Civil Status:
                      </span>
                      <p className="capitalize">
                        {user.civil_status || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Contact:</span>
                      <p>{user.mobile_phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <FiMapPin className="mr-2" />
                    Residential Address
                  </h4>
                  {user.residential_address ? (
                    <div className="space-y-2">
                      {user.residential_address.house_number && (
                        <div>
                          <span className="text-gray-500 text-sm">
                            House/Lot Number:
                          </span>
                          <p>{user.residential_address.house_number}</p>
                        </div>
                      )}
                      {user.residential_address.street_name && (
                        <div>
                          <span className="text-gray-500 text-sm">
                            Street Name:
                          </span>
                          <p>{user.residential_address.street_name}</p>
                        </div>
                      )}
                      {user.residential_address.purok && (
                        <div>
                          <span className="text-gray-500 text-sm">
                            Purok/Zone:
                          </span>
                          <p>{user.residential_address.purok}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500 text-sm">Barangay:</span>
                        <p>{user.residential_address.barangay}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">
                          City/Municipality:
                        </span>
                        <p>{user.residential_address.city}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Province:</span>
                        <p>{user.residential_address.province}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No address information provided
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Info & Actions */}
              <div className="bg-gray-100 p-4 rounded-md border border-gray-200 mb-4">
                <div className="flex items-start">
                  <FiInfo className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Verification Request Information
                    </h4>
                    <p className="text-sm text-gray-600">
                      This user has requested account verification. Please
                      review their information and either approve or reject
                      their request. Verified users will have access to
                      additional barangay services.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() =>
                    handleUpdateVerification(
                      user.id,
                      VerificationStatus.REJECTED
                    )
                  }
                  disabled={processingIds.includes(user.id)}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    processingIds.includes(user.id)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  } transition-colors`}
                >
                  {processingIds.includes(user.id) ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FiXCircle className="mr-2" />
                  )}
                  Reject
                </button>
                <button
                  onClick={() =>
                    handleUpdateVerification(
                      user.id,
                      VerificationStatus.VERIFIED
                    )
                  }
                  disabled={processingIds.includes(user.id)}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    processingIds.includes(user.id)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  } transition-colors`}
                >
                  {processingIds.includes(user.id) ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FiCheckCircle className="mr-2" />
                  )}
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PendingVerifications;
