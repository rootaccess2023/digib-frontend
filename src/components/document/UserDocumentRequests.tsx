import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiUserCheck,
  FiSend,
  FiAlertTriangle,
  FiBriefcase,
  FiRefreshCw,
  FiHelpCircle,
} from "react-icons/fi";
import DocumentService, {
  DocumentRequest,
  DocumentType,
  DOCUMENT_TYPES,
} from "../../services/DocumentService";
import { showErrorToast } from "../../utils/toast";
import DocumentStatusBadge from "./DocumentStatusBadge";
import DocumentRequestDetails from "./DocumentRequestDetails";

const UserDocumentRequests: React.FC = () => {
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<DocumentRequest | null>(null);

  // Load document requests on component mount
  useEffect(() => {
    fetchDocumentRequests();
  }, []);

  // Fetch user's document requests
  const fetchDocumentRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DocumentService.getUserDocumentRequests();
      setDocumentRequests(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load document requests"
      );
      showErrorToast(
        err instanceof Error ? err.message : "Failed to load document requests"
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

  // Get icon component for document type
  const getDocumentTypeIcon = (documentType: DocumentType) => {
    const iconName = DOCUMENT_TYPES[documentType]?.icon || "FiFileText";

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

  // Get document type title
  const getDocumentTypeTitle = (documentType: DocumentType) => {
    return DOCUMENT_TYPES[documentType]?.title || "Document";
  };

  // View document request details
  const handleViewRequest = (request: DocumentRequest) => {
    setSelectedRequest(request);
  };

  // Close document request details
  const handleCloseDetails = () => {
    setSelectedRequest(null);
  };

  // Refresh after changes
  const handleRefreshAfterChange = () => {
    fetchDocumentRequests();
    setSelectedRequest(null);
  };

  // If viewing details, show the details view
  if (selectedRequest) {
    return (
      <DocumentRequestDetails
        documentRequest={selectedRequest}
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
        <p>Error: show{error}</p>
      </div>
    );
  }

  if (documentRequests.length === 0) {
    return (
      <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <FiFileText className="text-gray-300 text-6xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Document Requests Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            You haven't requested any documents yet. Documents like Barangay
            Clearance, Certificate of Residency, and more can be requested
            through this system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex">
          <FiHelpCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="text-blue-800 font-medium mb-1">
              About Document Requests
            </h3>
            <p className="text-blue-700 text-sm">
              This section allows you to request various official documents from
              your barangay. You can track the status of your requests and view
              details. Once approved, you may need to visit the barangay office
              to pay any applicable fees and collect your documents.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={fetchDocumentRequests}
          className="flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {documentRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewRequest(request)}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    {getDocumentTypeIcon(request.document_type as DocumentType)}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 mb-1">
                      {getDocumentTypeTitle(
                        request.document_type as DocumentType
                      )}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Reference: {request.reference_number || "Pending"}
                    </p>
                  </div>
                </div>

                <DocumentStatusBadge status={request.status} />
              </div>

              <div className="mb-2">
                <span className="text-gray-500 text-sm">Purpose:</span>
                <p className="text-gray-700">{request.purpose}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Requested on:</p>
                  <p className="font-medium">
                    {formatDate(request.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Fee Amount:</p>
                  <p className="font-medium">₱{request.fee_amount}</p>
                </div>

                <div>
                  <p className="text-gray-500">Payment Status:</p>
                  <p
                    className={`font-medium ${
                      request.fee_paid ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {request.fee_paid ? "Paid" : "Unpaid"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {request.days_ago === 0
                  ? "Requested today"
                  : request.days_ago === 1
                  ? "Requested yesterday"
                  : `Requested ${request.days_ago} days ago`}
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

export default UserDocumentRequests;
