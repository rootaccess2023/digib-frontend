import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiX,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiUserCheck,
  FiSend,
  FiAlertTriangle,
  FiBriefcase,
  FiCheck,
  FiActivity,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import DocumentService, {
  DocumentRequest,
  DocumentType,
  DOCUMENT_TYPES,
} from "../../services/DocumentService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import DocumentStatusBadge from "./DocumentStatusBadge";
import DocumentProcessingModal from "./DocumentProcessingModal";

const DocumentManagement: React.FC = () => {
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDocumentType, setFilterDocumentType] = useState<string>("");
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentRequest | null>(null);

  // Load document requests on component mount and when filters change
  useEffect(() => {
    fetchDocumentRequests();
  }, [filterStatus, filterDocumentType]);

  // Function to fetch document requests
  const fetchDocumentRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DocumentService.getAllDocumentRequests(
        filterStatus,
        filterDocumentType
      );
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

  // Filter document requests based on search term
  const filteredDocumentRequests = documentRequests.filter((doc) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const refNumber = doc.reference_number?.toLowerCase() || "";
    const purpose = doc.purpose.toLowerCase();
    const userName = `${doc.user?.first_name || ""} ${
      doc.user?.last_name || ""
    }`.toLowerCase();
    const email = doc.user?.email.toLowerCase() || "";
    const documentType =
      DOCUMENT_TYPES[doc.document_type as DocumentType]?.title.toLowerCase() ||
      "";

    return (
      refNumber.includes(searchLower) ||
      purpose.includes(searchLower) ||
      userName.includes(searchLower) ||
      email.includes(searchLower) ||
      documentType.includes(searchLower)
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

  // Get document title from type
  const getDocumentTitle = (documentType: string) => {
    return DOCUMENT_TYPES[documentType as DocumentType]?.title || "Document";
  };

  // Get document icon component based on type
  const getDocumentTypeIcon = (documentType: string) => {
    const iconName =
      DOCUMENT_TYPES[documentType as DocumentType]?.icon || "FiFileText";

    switch (iconName) {
      case "FiFileText":
        return <FiFileText className="text-blue-600" />;
      case "FiHome":
        return <FiHome className="text-green-600" />;
      case "FiDollarSign":
        return <FiDollarSign className="text-yellow-600" />;
      case "FiCreditCard":
        return <FiCreditCard className="text-purple-600" />;
      case "FiUserCheck":
        return <FiUserCheck className="text-indigo-600" />;
      case "FiSend":
        return <FiSend className="text-teal-600" />;
      case "FiAlertTriangle":
        return <FiAlertTriangle className="text-orange-600" />;
      case "FiBriefcase":
        return <FiBriefcase className="text-red-600" />;
      default:
        return <FiFileText className="text-blue-600" />;
    }
  };

  // Get user full name
  const getUserName = (documentRequest: DocumentRequest) => {
    if (!documentRequest.user) return "Unknown";

    if (documentRequest.user.first_name && documentRequest.user.last_name) {
      return `${documentRequest.user.first_name} ${documentRequest.user.last_name}`;
    }

    return documentRequest.user.email.split("@")[0];
  };

  // Handle opening the processing modal
  const handleOpenProcessing = (documentRequest: DocumentRequest) => {
    setSelectedDocument(documentRequest);
  };

  // Handle closing the processing modal
  const handleCloseProcessing = () => {
    setSelectedDocument(null);
  };

  // Handle refreshing after a status change
  const handleRefreshAfterChange = () => {
    fetchDocumentRequests();
    setSelectedDocument(null);
  };

  // Get empty state message based on filters
  const getEmptyStateMessage = () => {
    const typeText = filterDocumentType
      ? getDocumentTitle(filterDocumentType)
      : "document";

    if (filterStatus) {
      return {
        title: `No ${filterStatus} ${typeText} requests`,
        message: `There are no ${typeText} requests with ${filterStatus} status at this time.`,
      };
    }

    return {
      title: "No document requests",
      message: "There are no document requests at this time.",
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
          Manage Document Requests
        </h1>

        <button
          onClick={fetchDocumentRequests}
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

        {/* Document type filter */}
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Document Type
          </label>
          <div className="relative">
            <select
              value={filterDocumentType}
              onChange={(e) => setFilterDocumentType(e.target.value)}
              className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Document Types</option>
              {Object.entries(DOCUMENT_TYPES).map(([type, info]) => (
                <option key={type} value={type}>
                  {info.title}
                </option>
              ))}
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
            icon: <FiClock className="text-yellow-600" />,
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
              ? documentRequests.length
              : documentRequests.filter((c) => c.status === stat.status).length;

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

      {/* Document request list */}
      {filteredDocumentRequests.length === 0 ? (
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
                    Document Type
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
                {filteredDocumentRequests.map((docRequest) => (
                  <tr key={docRequest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {docRequest.reference_number || "Pending"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          {getDocumentTypeIcon(docRequest.document_type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getDocumentTitle(docRequest.document_type)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                          {(
                            docRequest.user?.first_name?.charAt(0) ||
                            docRequest.user?.email?.charAt(0) ||
                            "?"
                          ).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getUserName(docRequest)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {docRequest.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-xs">
                        {docRequest.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DocumentStatusBadge status={docRequest.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(docRequest.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleOpenProcessing(docRequest)}
                        className="font-medium text-blue-600 hover:text-blue-900"
                      >
                        {docRequest.status === "pending"
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
      {selectedDocument && (
        <DocumentProcessingModal
          documentRequest={selectedDocument}
          onClose={handleCloseProcessing}
          onRefresh={handleRefreshAfterChange}
        />
      )}
    </div>
  );
};

export default DocumentManagement;
