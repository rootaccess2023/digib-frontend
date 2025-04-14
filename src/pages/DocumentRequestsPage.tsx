import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DocumentTypeSelector from "../components/document/DocumentTypeSelector";
import DocumentRequestForm from "../components/document/DocumentRequestForm";
import UserDocumentRequests from "../components/document/UserDocumentRequests";
import { DocumentType } from "../services/DocumentService";
import { FiFileText, FiPlus } from "react-icons/fi";

const DocumentRequestsPage: React.FC = () => {
  const { authState } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType | null>(null);
  const [view, setView] = useState<"list" | "select" | "form">("list");

  // Start creating a new document request
  const handleNewRequest = () => {
    setView("select");
  };

  // Handle document type selection
  const handleSelectType = (type: DocumentType) => {
    setSelectedDocumentType(type);
    setView("form");
  };

  // Cancel document request creation
  const handleCancelRequest = () => {
    setView("list");
    setSelectedDocumentType(null);
  };

  // Go back to type selection
  const handleBackToTypeSelection = () => {
    setView("select");
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiFileText className="mr-3" />
          Document Requests
        </h1>

        {view === "list" && (
          <button
            onClick={handleNewRequest}
            className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <FiPlus className="mr-2" />
            New Request
          </button>
        )}
      </div>

      {view === "list" && <UserDocumentRequests />}

      {view === "select" && (
        <DocumentTypeSelector onSelectType={handleSelectType} />
      )}

      {view === "form" && selectedDocumentType && (
        <DocumentRequestForm
          documentType={selectedDocumentType}
          onCancel={handleCancelRequest}
          onBack={handleBackToTypeSelection}
        />
      )}
    </div>
  );
};

export default DocumentRequestsPage;
