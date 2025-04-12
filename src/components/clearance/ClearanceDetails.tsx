import React, { useState } from "react";
import {
  FiFileText,
  FiArrowLeft,
  FiTrash2,
  FiAlertTriangle,
  FiClock,
  FiCheck,
  FiActivity,
  FiXCircle,
  FiCheckCircle,
} from "react-icons/fi";
import ClearanceService, {
  BarangayClearance,
} from "../../services/ClearanceService";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../../utils/toast";
import ClearanceStatusBadge from "./ClearanceStatusBadge";

interface ClearanceDetailsProps {
  clearance: BarangayClearance;
  onClose: () => void;
  onRefresh: () => void;
}

const ClearanceDetails: React.FC<ClearanceDetailsProps> = ({
  clearance,
  onClose,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  // Handle delete request
  const handleDelete = async () => {
    if (clearance.status !== "pending") {
      showWarningToast("Only pending requests can be deleted");
      return;
    }

    setLoading(true);
    try {
      await ClearanceService.deleteClearance(clearance.id);
      showSuccessToast("Clearance request deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Error deleting clearance:", error);
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Failed to delete clearance request"
      );
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Get status steps
  const getStatusSteps = () => {
    const steps = [
      {
        status: "pending",
        label: "Submitted",
        icon: <FiClock />,
        completed: true,
      },
      {
        status: "processing",
        label: "Processing",
        icon: <FiActivity />,
        completed: ["processing", "approved", "completed"].includes(
          clearance.status
        ),
      },
      {
        status: "approved",
        label: "Approved",
        icon: <FiCheck />,
        completed: ["approved", "completed"].includes(clearance.status),
      },
      {
        status: "completed",
        label: "Completed",
        icon: <FiCheckCircle />,
        completed: clearance.status === "completed",
      },
    ];

    return steps;
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onClose}
          className="mr-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <FiArrowLeft className="text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiFileText className="mr-3" />
          Barangay Clearance Details
        </h1>
      </div>

      {/* Main details card */}
      <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-1">
                {clearance.purpose}
              </h2>
              <p className="text-gray-600">
                Reference: {clearance.reference_number || "Pending"}
              </p>
            </div>
            <ClearanceStatusBadge status={clearance.status} />
          </div>

          {/* Status progress indicator for non-rejected clearances */}
          {clearance.status !== "rejected" && (
            <div className="mb-6 pt-4">
              <div className="relative">
                {/* Progress line */}
                <div className="absolute bottom-6 inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200"></div>
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {getStatusSteps().map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div className="text-xs mt-2 text-gray-600">
                        {step.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rejected notice */}
          {clearance.status === "rejected" && clearance.remarks && (
            <div className="my-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <FiAlertTriangle className="text-red-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-red-800">Request Rejected</h4>
                  <p className="text-red-700 mt-1">
                    Reason: {clearance.remarks}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Important notices based on status */}
          {clearance.status === "approved" && (
            <div className="my-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <FiCheck className="text-green-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Clearance Approved
                  </h4>
                  <p className="text-green-700 mt-1">
                    Your clearance has been approved. Please visit the Barangay
                    Hall to pay the fee and claim your document. Remember to
                    bring your government ID, Cedula, and the reference number
                    shown above.
                  </p>
                </div>
              </div>
            </div>
          )}

          {clearance.status === "completed" && (
            <div className="my-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <FiCheckCircle className="text-green-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Clearance Complete
                  </h4>
                  <p className="text-green-700 mt-1">
                    Your clearance has been issued. If you have any questions
                    about this document or need additional copies, please
                    contact the Barangay Office.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Request Information
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Requested on:</div>
                  <div className="text-sm font-medium">
                    {formatDate(clearance.created_at)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Current Status:</div>
                  <div className="text-sm font-medium capitalize">
                    {clearance.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Fee Amount:</div>
                  <div className="text-sm font-medium">
                    ₱{clearance.fee_amount}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Payment Status:</div>
                  <div
                    className={`text-sm font-medium ${
                      clearance.fee_paid ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {clearance.fee_paid ? "Paid" : "Unpaid"}
                  </div>
                </div>

                {clearance.approved_by && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Approved By:</div>
                    <div className="text-sm font-medium">
                      {clearance.approved_by.first_name}{" "}
                      {clearance.approved_by.last_name}
                    </div>
                  </div>
                )}

                {clearance.approved_at && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Approved On:</div>
                    <div className="text-sm font-medium">
                      {formatDate(clearance.approved_at)}
                    </div>
                  </div>
                )}

                {clearance.rejected_by && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Rejected By:</div>
                    <div className="text-sm font-medium">
                      {clearance.rejected_by.first_name}{" "}
                      {clearance.rejected_by.last_name}
                    </div>
                  </div>
                )}

                {clearance.rejected_at && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Rejected On:</div>
                    <div className="text-sm font-medium">
                      {formatDate(clearance.rejected_at)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Supporting Documents
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">ID Type:</div>
                  <div className="text-sm font-medium">
                    {clearance.government_id_type}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Cedula Number:</div>
                  <div className="text-sm font-medium">
                    {clearance.cedula_number}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">
                    Cedula Issue Date:
                  </div>
                  <div className="text-sm font-medium">
                    {formatDate(clearance.cedula_issued_date)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Cedula Issued At:</div>
                  <div className="text-sm font-medium">
                    {clearance.cedula_issued_at}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to List
          </button>

          {/* Only show delete button for pending requests */}
          {clearance.status === "pending" && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  <FiTrash2 className="mr-2" />
                  Cancel Request
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Cancel Clearance Request
            </h3>
            <p className="text-gray-500 mb-5">
              Are you sure you want to cancel this barangay clearance request?
              This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Keep Request
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2" />
                    Yes, Cancel Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClearanceDetails;
