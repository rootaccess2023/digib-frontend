import React, { useState } from "react";
import {
  FiX,
  FiCheck,
  FiActivity,
  FiXCircle,
  FiCheckCircle,
  FiAlertTriangle,
  FiFileText,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiUserCheck,
  FiSend,
  FiBriefcase,
  FiInfo,
} from "react-icons/fi";
import DocumentService, {
  DocumentRequest,
  DocumentType,
  DOCUMENT_TYPES,
} from "../../services/DocumentService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import DocumentStatusBadge from "./DocumentStatusBadge";

interface DocumentProcessingModalProps {
  documentRequest: DocumentRequest;
  onClose: () => void;
  onRefresh: () => void;
}

const DocumentProcessingModal: React.FC<DocumentProcessingModalProps> = ({
  documentRequest,
  onClose,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Get document type information
  const documentTypeInfo =
    DOCUMENT_TYPES[documentRequest.document_type as DocumentType];

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

  // Get document type icon
  const getDocumentTypeIcon = () => {
    const iconName = documentTypeInfo?.icon || "FiFileText";

    switch (iconName) {
      case "FiFileText":
        return <FiFileText className="text-blue-500" />;
      case "FiHome":
        return <FiHome className="text-green-500" />;
      case "FiDollarSign":
        return <FiDollarSign className="text-yellow-500" />;
      case "FiCreditCard":
        return <FiCreditCard className="text-purple-500" />;
      case "FiUserCheck":
        return <FiUserCheck className="text-indigo-500" />;
      case "FiSend":
        return <FiSend className="text-teal-500" />;
      case "FiAlertTriangle":
        return <FiAlertTriangle className="text-orange-500" />;
      case "FiBriefcase":
        return <FiBriefcase className="text-red-500" />;
      default:
        return <FiFileText className="text-blue-500" />;
    }
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
      await DocumentService.updateDocumentRequestStatus(
        documentRequest.id,
        status,
        status === "rejected" ? remarks : undefined
      );

      showSuccessToast(`Document request status updated to ${status}`);
      onRefresh();
    } catch (error) {
      console.error("Error updating document request status:", error);
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Failed to update document request status"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get allowed actions based on current status
  const getAllowedActions = () => {
    switch (documentRequest.status) {
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
    if (!documentRequest.user) return "Unknown";

    if (documentRequest.user.first_name && documentRequest.user.last_name) {
      return `${documentRequest.user.first_name} ${documentRequest.user.last_name}`;
    }

    return documentRequest.user.email.split("@")[0];
  };

  // Format document data for display
  const formatDocumentData = (key: string, value: any) => {
    // Skip functions or objects for which we don't want direct display
    if (
      typeof value === "function" ||
      (typeof value === "object" && value !== null && !Array.isArray(value))
    ) {
      return null;
    }

    // Format boolean values
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // Format date strings (check if string and matches date format)
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return formatDate(value);
    }

    // Format arrays
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    // Return as is for other values
    return value;
  };

  // Render document data
  const renderDocumentData = () => {
    if (
      !documentRequest.document_data ||
      typeof documentRequest.document_data !== "object"
    ) {
      return <p className="text-gray-500">No additional data</p>;
    }

    return (
      <div className="space-y-3">
        {Object.entries(documentRequest.document_data).map(([key, value]) => {
          const formattedValue = formatDocumentData(key, value);

          // Skip if no formatted value
          if (formattedValue === null) return null;

          // Format the key for display
          const displayKey = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <div key={key} className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">{displayKey}:</div>
              <div className="text-sm font-medium">{formattedValue}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-900 flex items-center">
            <span className="mr-3">
              {documentRequest.status === "pending" ? (
                <FiActivity className="text-blue-500" />
              ) : (
                <DocumentStatusBadge status={documentRequest.status} />
              )}
            </span>
            Process {documentTypeInfo?.title || "Document"} Request
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
                    {documentRequest.reference_number || "Pending"}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Document Type:</span>
                  <p className="text-sm font-medium flex items-center">
                    <span className="mr-2">{getDocumentTypeIcon()}</span>
                    {documentTypeInfo?.title || "Document"}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Purpose:</span>
                  <p className="text-sm font-medium">
                    {documentRequest.purpose}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Requested On:</span>
                  <p className="text-sm font-medium">
                    {formatDate(documentRequest.created_at)}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Current Status:</span>
                  <p className="text-sm font-medium capitalize flex items-center mt-1">
                    <DocumentStatusBadge status={documentRequest.status} />
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Fee Amount:</span>
                  <p className="text-sm font-medium">
                    ₱{documentRequest.fee_amount}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Payment Status:</span>
                  <p
                    className={`text-sm font-medium ${
                      documentRequest.fee_paid
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {documentRequest.fee_paid ? "Paid" : "Unpaid"}
                  </p>
                </div>

                {documentRequest.approved_by && (
                  <div>
                    <span className="text-sm text-gray-500">Approved By:</span>
                    <p className="text-sm font-medium">
                      {documentRequest.approved_by.first_name}{" "}
                      {documentRequest.approved_by.last_name}
                    </p>
                  </div>
                )}

                {documentRequest.approved_at && (
                  <div>
                    <span className="text-sm text-gray-500">Approved On:</span>
                    <p className="text-sm font-medium">
                      {formatDate(documentRequest.approved_at)}
                    </p>
                  </div>
                )}

                {documentRequest.rejected_by && (
                  <div>
                    <span className="text-sm text-gray-500">Rejected By:</span>
                    <p className="text-sm font-medium">
                      {documentRequest.rejected_by.first_name}{" "}
                      {documentRequest.rejected_by.last_name}
                    </p>
                  </div>
                )}

                {documentRequest.rejected_at && (
                  <div>
                    <span className="text-sm text-gray-500">Rejected On:</span>
                    <p className="text-sm font-medium">
                      {formatDate(documentRequest.rejected_at)}
                    </p>
                  </div>
                )}

                {documentRequest.remarks && (
                  <div>
                    <span className="text-sm text-gray-500">Remarks:</span>
                    <p className="text-sm font-medium">
                      {documentRequest.remarks}
                    </p>
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
                    documentRequest.user?.first_name?.charAt(0) ||
                    documentRequest.user?.email?.charAt(0) ||
                    "?"
                  ).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    {getUserName()}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {documentRequest.user?.email}
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-6 mb-3">
                Document Data
              </h4>

              {renderDocumentData()}
            </div>
          </div>

          {/* Rejection form */}
          {showRejectForm && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex mb-3">
                <FiAlertTriangle className="text-red-600 mt-0.5 mr-3" />
                <h3 className="font-medium text-red-800">
                  Reject Document Request
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
          {documentRequest.status === "pending" && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <FiActivity className="text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-800">
                    Processing Instructions
                  </h4>
                  <p className="text-blue-700 mt-1 text-sm">
                    Before approving this document request, please verify:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-700 text-sm">
                    <li>The resident is verified in the system</li>
                    <li>The purpose stated is legitimate and valid</li>
                    <li>All required information has been provided</li>
                    <li>
                      The document type is appropriate for the stated purpose
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Approval instructions */}
          {documentRequest.status === "processing" && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <FiCheck className="text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-800">
                    Approval Instructions
                  </h4>
                  <p className="text-blue-700 mt-1 text-sm">
                    Before approving this document, ensure that all information
                    has been verified:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-700 text-sm">
                    <li>All required information is accurate and complete</li>
                    <li>The resident's identity has been verified</li>
                    <li>The purpose for requesting the document is valid</li>
                    <li>
                      The resident has met all requirements for this document
                    </li>
                  </ul>
                  <p className="text-blue-700 mt-2 text-sm">
                    After approval, the resident will need to visit the Barangay
                    Hall to pay the fee and claim their document.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Completion instructions */}
          {documentRequest.status === "approved" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex">
                <FiCheckCircle className="text-green-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Completion Instructions
                  </h4>
                  <p className="text-green-700 mt-1 text-sm">
                    Mark this document as completed only after:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-green-700 text-sm">
                    <li>
                      The resident has paid the document fee (₱
                      {documentRequest.fee_amount})
                    </li>
                    <li>The physical document has been printed and signed</li>
                    <li>The document has been handed over to the resident</li>
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

export default DocumentProcessingModal;
