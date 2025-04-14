import React from "react";
import {
  FiFileText,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiUserCheck,
  FiSend,
  FiAlertTriangle,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";
import DocumentService, { DocumentType } from "../../services/DocumentService";

interface DocumentTypeSelectorProps {
  onSelectType: (type: DocumentType) => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  onSelectType,
}) => {
  const documentTypes = DocumentService.getAllDocumentTypes();

  // Function to get icon component based on icon name string
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FiFileText":
        return <FiFileText className="text-2xl" />;
      case "FiHome":
        return <FiHome className="text-2xl" />;
      case "FiDollarSign":
        return <FiDollarSign className="text-2xl" />;
      case "FiCreditCard":
        return <FiCreditCard className="text-2xl" />;
      case "FiUserCheck":
        return <FiUserCheck className="text-2xl" />;
      case "FiSend":
        return <FiSend className="text-2xl" />;
      case "FiAlertTriangle":
        return <FiAlertTriangle className="text-2xl" />;
      case "FiBriefcase":
        return <FiBriefcase className="text-2xl" />;
      default:
        return <FiFileText className="text-2xl" />;
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Select Document Type
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentTypes.map((docType) => (
          <div
            key={docType.type}
            className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white overflow-hidden"
            onClick={() => onSelectType(docType.type)}
          >
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  {getIconComponent(docType.icon)}
                </div>
                <h3 className="font-medium text-lg">{docType.title}</h3>
              </div>

              <p className="text-gray-600 text-sm mb-3">
                {docType.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">Fee:</span> ₱
                  {docType.fee.toFixed(2)}
                </div>
                <div className="text-blue-600 text-sm flex items-center font-medium">
                  <span>Request</span>
                  <FiArrowRight className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentTypeSelector;
