import React, { useState } from "react";
import {
  FiX,
  FiCheck,
  FiActivity,
  FiXCircle,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import ClearanceService, {
  BarangayClearance,
} from "../../services/ClearanceService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import ClearanceStatusBadge from "./ClearanceStatusBadge";

interface ClearanceProcessingModalProps {
  clearance: BarangayClearance;
  onClose: () => void;
  onRefresh: () => void;
}

const ClearanceProcessingModal: React.FC<ClearanceProcessingModalProps> = ({
  clearance,
  onClose,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Format date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle status update
  const handleUpdateStatus = async (status: string) => {
    // For rejection, we need remarks
    if (status === "rejected" && !remarks.trim()) {
      showErrorToast("Please provide a reason for rejection");
      return;
    }

    setLoading(true);
    try {
      await ClearanceService.updateClearanceStatus(
        clearance.id,
        status,
        status === "rejected" ? remarks : undefined
      );

      showSuccessToast(`Clearance status updated to ${status}`);
      onRefresh();
    } catch (error) {
      console.error("Error updating clearance status:", error);
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Failed to update clearance status"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get allowed actions based on current status
  const getAllowedActions = () => {
    switch (clearance.status) {
      case "pending":
        return (
          <div className="flex space-x-3">
            <button
              onClick={() => handleUpdateStatus("processing")}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <FiActivity className="mr-2" />
              )}
              Start Processing
            </button>

            <button
              onClick={() => setShowRejectForm(true)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <FiXCircle className="mr-2" />
              Reject
            </button>
          </div>
        );

      case "processing":
        return (
          <div className="flex space-x-3">
            <button
              onClick={() => handleUpdateStatus("approved")}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <FiCheck className="mr-2" />
              )}
              Approve
            </button>

            <button
              onClick={() => setShowRejectForm(true)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <FiXCircle className="mr-2" />
              Reject
            </button>
          </div>
        );

      case "approved":
        return (
          <button
            onClick={() => handleUpdateStatus("completed")}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <FiCheckCircle className="mr-2" />
            )}
            Mark as Completed
          </button>
        );

      default:
        // For completed or rejected, no actions needed
        return null;
    }
  };

  // Get user full name
  const getUserName = () => {
    if (!clearance.user) return "Unknown";

    if (clearance.user.first_name && clearance.user.last_name) {
      return `${clearance.user.first_name} ${clearance.user.last_name}`;
    }

    return clearance.user.email.split("@")[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-900 flex items-center">
            <span className="mr-3">
              {clearance.status === "pending" ? (
                <FiActivity className="text-blue-500" />
              ) : (
                <ClearanceStatusBadge status={clearance.status} />
              )}
            </span>
            Process Clearance Request
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Modal body - scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Basic info section */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Request Details
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">
                    Reference Number:
                  </span>
                  <p className="text-sm font-medium">
                    {clearance.reference_number || "Pending"}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Purpose:</span>
                  <p className="text-sm font-medium">{clearance.purpose}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Requested On:</span>
                  <p className="text-sm font-medium">
                    {formatDate(clearance.created_at)}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Current Status:</span>
                  <p className="text-sm font-medium capitalize flex items-center mt-1">
                    <ClearanceStatusBadge status={clearance.status} />
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Fee Amount:</span>
                  <p className="text-sm font-medium">₱{clearance.fee_amount}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Payment Status:</span>
                  <p
                    className={`text-sm font-medium ${
                      clearance.fee_paid ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {clearance.fee_paid ? "Paid" : "Unpaid"}
                  </p>
                </div>

                {clearance.approved_by && (
                  <div>
                    <span className="text-sm text-gray-500">Approved By:</span>
                    <p className="text-sm font-medium">
                      {clearance.approved_by.first_name}{" "}
                      {clearance.approved_by.last_name}
                    </p>
                  </div>
                )}

                {clearance.approved_at && (
                  <div>
                    <span className="text-sm text-gray-500">Approved On:</span>
                    <p className="text-sm font-medium">
                      {formatDate(clearance.approved_at)}
                    </p>
                  </div>
                )}

                {clearance.rejected_by && (
                  <div>
                    <span className="text-sm text-gray-500">Rejected By:</span>
                    <p className="text-sm font-medium">
                      {clearance.rejected_by.first_name}{" "}
                      {clearance.rejected_by.last_name}
                    </p>
                  </div>
                )}

                {clearance.rejected_at && (
                  <div>
                    <span className="text-sm text-gray-500">Rejected On:</span>
                    <p className="text-sm font-medium">
                      {formatDate(clearance.rejected_at)}
                    </p>
                  </div>
                )}

                {clearance.remarks && (
                  <div>
                    <span className="text-sm text-gray-500">Remarks:</span>
                    <p className="text-sm font-medium">{clearance.remarks}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Resident Information
              </h3>

              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {(
                    clearance.user?.first_name?.charAt(0) ||
                    clearance.user?.email?.charAt(0) ||
                    "?"
                  ).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    {getUserName()}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {clearance.user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">
                    Government ID Type:
                  </span>
                  <p className="text-sm font-medium">
                    {clearance.government_id_type}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Cedula Number:</span>
                  <p className="text-sm font-medium">
                    {clearance.cedula_number}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    Cedula Issue Date:
                  </span>
                  <p className="text-sm font-medium">
                    {formatDate(clearance.cedula_issued_date)}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    Cedula Issued At:
                  </span>
                  <p className="text-sm font-medium">
                    {clearance.cedula_issued_at}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rejection form */}
          {showRejectForm && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex mb-3">
                <FiAlertTriangle className="text-red-600 mt-0.5 mr-3" />
                <h3 className="font-medium text-red-800">
                  Reject Clearance Request
                </h3>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full border border-red-300 rounded-md p-2 text-sm focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Provide a reason for rejection..."
                />
                {!remarks.trim() && (
                  <p className="mt-1 text-sm text-red-600">
                    A reason is required for rejection
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={!remarks.trim() || loading}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : (
                    <FiXCircle className="mr-1.5" />
                  )}
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}

          {/* Processing instructions */}
          {clearance.status === "pending" && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <FiActivity className="text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-800">
                    Processing Instructions
                  </h4>
                  <p className="text-blue-700 mt-1 text-sm">
                    Before approving this clearance request, please verify:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-700 text-sm">
                    <li>The resident is verified in the system</li>
                    <li>
                      The resident has been living in the barangay for at least
                      6 months
                    </li>
                    <li>
                      The provided cedula (Community Tax Certificate) is valid
                    </li>
                    <li>The purpose of the clearance is legitimate</li>
                    <li>There are no pending cases against the resident</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Approval instructions */}
          {clearance.status === "processing" && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <FiCheck className="text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-800">
                    Approval Instructions
                  </h4>
                  <p className="text-blue-700 mt-1 text-sm">
                    Before approving this clearance, ensure that all
                    requirements have been verified:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-700 text-sm">
                    <li>All required documents have been reviewed</li>
                    <li>The cedula information has been validated</li>
                    <li>The resident's information is accurate</li>
                    <li>The purpose for requesting the clearance is valid</li>
                  </ul>
                  <p className="text-blue-700 mt-2 text-sm">
                    After approval, the resident will need to visit the Barangay
                    Hall to pay the fee and claim their clearance document.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Completion instructions */}
          {clearance.status === "approved" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex">
                <FiCheckCircle className="text-green-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Completion Instructions
                  </h4>
                  <p className="text-green-700 mt-1 text-sm">
                    Mark this clearance as completed only after:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-green-700 text-sm">
                    <li>
                      The resident has paid the clearance fee (₱
                      {clearance.fee_amount})
                    </li>
                    <li>
                      The physical clearance document has been printed and
                      signed
                    </li>
                    <li>The clearance has been handed over to the resident</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>

          {/* Action buttons based on status */}
          {getAllowedActions()}
        </div>
      </div>
    </div>
  );
};

export default ClearanceProcessingModal;
