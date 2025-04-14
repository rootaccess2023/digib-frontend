import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiAlertTriangle,
  FiSave,
  FiX,
  FiHelpCircle,
  FiChevronLeft,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiUserCheck,
  FiSend,
  FiBriefcase,
} from "react-icons/fi";
import DocumentService, {
  DocumentType,
  DocumentTypeInfo,
  DocumentCreateData,
} from "../../services/DocumentService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

interface DocumentRequestFormProps {
  documentType: DocumentType;
  onCancel: () => void;
  onBack: () => void;
}

const DocumentRequestForm: React.FC<DocumentRequestFormProps> = ({
  documentType,
  onCancel,
  onBack,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get document type metadata
  const documentTypeInfo = DocumentService.getDocumentTypeInfo(documentType);

  // Form data state
  const [formData, setFormData] = useState<{
    purpose: string;
    document_data: any;
  }>({
    purpose: "",
    document_data: {},
  });

  // Custom purpose state (for "Other" option)
  const [customPurpose, setCustomPurpose] = useState("");
  const [showCustomPurpose, setShowCustomPurpose] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Function to get icon component based on icon name string
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FiFileText":
        return <FiFileText />;
      case "FiHome":
        return <FiHome />;
      case "FiDollarSign":
        return <FiDollarSign />;
      case "FiCreditCard":
        return <FiCreditCard />;
      case "FiUserCheck":
        return <FiUserCheck />;
      case "FiSend":
        return <FiSend />;
      case "FiAlertTriangle":
        return <FiAlertTriangle />;
      case "FiBriefcase":
        return <FiBriefcase />;
      default:
        return <FiFileText />;
    }
  };

  // Handle purpose selection
  const handlePurposeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    if (value === "Other (Please specify)") {
      setShowCustomPurpose(true);
      setFormData({ ...formData, purpose: customPurpose });
    } else {
      setShowCustomPurpose(false);
      setFormData({ ...formData, purpose: value });
    }
  };

  // Handle custom purpose input
  const handleCustomPurposeChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setCustomPurpose(value);
    if (showCustomPurpose) {
      setFormData({ ...formData, purpose: value });
    }
  };

  // Handle document data changes
  const handleDocumentDataChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        document_data: {
          ...formData.document_data,
          [name]: checked,
        },
      });
      return;
    }

    // Handle other input types
    setFormData({
      ...formData,
      document_data: {
        ...formData.document_data,
        [name]: value,
      },
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate purpose
    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }

    // Validate required fields based on document type
    documentTypeInfo.requiredFields.forEach((field) => {
      if (
        !formData.document_data[field] ||
        (typeof formData.document_data[field] === "string" &&
          !formData.document_data[field].trim())
      ) {
        newErrors[field] = `${field
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const documentRequestData: DocumentCreateData = {
        document_type: documentType,
        purpose: formData.purpose,
        document_data: formData.document_data,
      };

      await DocumentService.createDocumentRequest(documentRequestData);
      showSuccessToast(
        `${documentTypeInfo.title} request submitted successfully`
      );
      navigate("/documents");
    } catch (error) {
      console.error("Failed to submit document request:", error);
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Failed to submit document request"
      );
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate input field based on field name
  const renderInputField = (fieldName: string) => {
    switch (fieldName) {
      // Barangay Clearance fields
      case "government_id_type":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Government ID Type <span className="text-red-500">*</span>
            </label>
            <select
              id={fieldName}
              name={fieldName}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            >
              <option value="">Select ID type</option>
              <option value="Voter's ID">Voter's ID</option>
              <option value="UMID">UMID</option>
              <option value="Driver's License">Driver's License</option>
              <option value="PhilHealth ID">PhilHealth ID</option>
              <option value="Passport">Passport</option>
              <option value="SSS ID">SSS ID</option>
              <option value="Postal ID">Postal ID</option>
              <option value="TIN ID">TIN ID</option>
              <option value="Senior Citizen ID">Senior Citizen ID</option>
              <option value="PWD ID">PWD ID</option>
              <option value="National ID">National ID</option>
              <option value="Other">Other</option>
            </select>
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "cedula_number":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Cedula (Community Tax Certificate) Number{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. 12345678"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "cedula_issued_date":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Cedula Issue Date <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="date"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "cedula_issued_at":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Cedula Issued At <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. City Treasurer's Office, Manila"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      // Certificate of Residency fields
      case "resident_since_date":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Resident Since (Date) <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="date"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "address_proof_type":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Proof of Residency Type <span className="text-red-500">*</span>
            </label>
            <select
              id={fieldName}
              name={fieldName}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            >
              <option value="">Select proof type</option>
              <option value="Electric Bill">Electric Bill</option>
              <option value="Water Bill">Water Bill</option>
              <option value="Internet/Cable Bill">Internet/Cable Bill</option>
              <option value="Property Tax Receipt">Property Tax Receipt</option>
              <option value="Lease Agreement">Lease Agreement</option>
              <option value="Property Title">Property Title</option>
              <option value="Voter's ID with address">
                Voter's ID with address
              </option>
              <option value="Barangay Certificate">Barangay Certificate</option>
              <option value="Other">Other</option>
            </select>
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      // Certificate of Indigency fields
      case "monthly_family_income":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Monthly Family Income (PHP){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="number"
              min="0"
              step="1000"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. 10000"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "number_of_dependents":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Number of Dependents <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="number"
              min="0"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. 3"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "assistance_purpose":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Purpose of Assistance <span className="text-red-500">*</span>
            </label>
            <textarea
              id={fieldName}
              name={fieldName}
              rows={3}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Describe why you need this assistance"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      // Barangay ID fields
      case "id_photo_provided":
        return (
          <div className="mb-5">
            <label className="flex items-center">
              <input
                id={fieldName}
                name={fieldName}
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={formData.document_data[fieldName] || false}
                onChange={handleDocumentDataChange}
              />
              <span className="ml-2 text-gray-700 text-sm">
                I will bring 2 pcs of 1x1 or 2x2 ID photos (white background) to
                the barangay office
                <span className="text-red-500"> *</span>
              </span>
            </label>
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "emergency_contact_name":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Emergency Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Full name of emergency contact"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "emergency_contact_number":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Emergency Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="tel"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. 09123456789"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      // Certificate of Good Moral Character fields
      case "years_of_residency":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Years of Residency in Barangay{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="number"
              min="0"
              step="1"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. 5"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "character_reference_name":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Character Reference Name <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Name of someone who can vouch for your character"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "character_reference_contact":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Character Reference Contact{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="tel"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Phone number of reference"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      // Endorsement Letter fields
      case "addressed_to":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Addressed To (Office/Institution){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. Department of Social Welfare and Development"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "endorsement_reason":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Reason for Endorsement <span className="text-red-500">*</span>
            </label>
            <textarea
              id={fieldName}
              name={fieldName}
              rows={3}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Detailed reason for requesting this endorsement"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "supporting_documents_description":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Supporting Documents Description{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id={fieldName}
              name={fieldName}
              rows={2}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="List the supporting documents you will bring (e.g. hospital bill, school ID)"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      // Blotter Record fields
      case "incident_date":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Incident Date <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="date"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "incident_location":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Incident Location <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Exact location where the incident occurred"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "persons_involved":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Persons Involved <span className="text-red-500">*</span>
            </label>
            <textarea
              id={fieldName}
              name={fieldName}
              rows={2}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Names of all individuals involved in the incident"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "incident_details":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Incident Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id={fieldName}
              name={fieldName}
              rows={4}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Detailed description of what happened during the incident"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "blotter_entry_number":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Blotter Entry Number (if known){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. B-2023-123 (leave blank if requesting a new blotter)"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "resolution_status":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Resolution Status <span className="text-red-500">*</span>
            </label>
            <select
              id={fieldName}
              name={fieldName}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            >
              <option value="">Select resolution status</option>
              <option value="Unresolved">Unresolved / Ongoing</option>
              <option value="Resolved">Resolved / Settled</option>
              <option value="Referred">Referred to higher authorities</option>
              <option value="Unknown">Unknown</option>
            </select>
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      // Business Clearance fields
      case "business_name":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Official registered name of the business"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "business_address":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Business Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id={fieldName}
              name={fieldName}
              rows={2}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Complete address of the business within the barangay"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "business_type":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Business Type <span className="text-red-500">*</span>
            </label>
            <select
              id={fieldName}
              name={fieldName}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            >
              <option value="">Select business type</option>
              <option value="Retail">Retail</option>
              <option value="Food">Food/Restaurant</option>
              <option value="Service">Service</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Construction">Construction</option>
              <option value="Transportation">Transportation</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Other">Other</option>
            </select>
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "business_area_sqm":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Business Area (in sq. meters){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="number"
              min="1"
              step="1"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. 100"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "business_owner_type":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              Business Owner Type <span className="text-red-500">*</span>
            </label>
            <select
              id={fieldName}
              name={fieldName}
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            >
              <option value="">Select owner type</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Corporation">Corporation</option>
              <option value="Cooperative">Cooperative</option>
            </select>
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "dti_registration_number":
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              DTI/SEC Registration Number{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Registration number from DTI or SEC"
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      case "lease_contract_provided":
        return (
          <div className="mb-5">
            <label className="flex items-center">
              <input
                id={fieldName}
                name={fieldName}
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={formData.document_data[fieldName] || false}
                onChange={handleDocumentDataChange}
              />
              <span className="ml-2 text-gray-700 text-sm">
                I will provide a lease contract or proof of property ownership
                <span className="text-red-500"> *</span>
              </span>
            </label>
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );

      default:
        return (
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor={fieldName}
            >
              {fieldName
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              type="text"
              className={`appearance-none border ${
                errors[fieldName] ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.document_data[fieldName] || ""}
              onChange={handleDocumentDataChange}
            />
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <FiChevronLeft className="text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          {getIconComponent(documentTypeInfo.icon)}
          <span className="ml-3">Request {documentTypeInfo.title}</span>
        </h1>
      </div>

      {/* Information box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex">
          <FiAlertTriangle className="text-blue-500 text-xl flex-shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="text-blue-800 font-medium mb-2">
              {documentTypeInfo.title} Requirements
            </h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-1 text-sm">
              {documentTypeInfo.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-blue-700">
              Fee: ₱{documentTypeInfo.fee.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Request Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-md shadow-sm border border-gray-200 p-6"
      >
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="purpose"
          >
            Purpose of {documentTypeInfo.title}{" "}
            <span className="text-red-500">*</span>
          </label>

          {documentTypeInfo.purpose_options ? (
            // If there are predefined purpose options, show a select
            <>
              <select
                id="purpose"
                name="purpose"
                className={`appearance-none border ${
                  errors.purpose ? "border-red-500" : "border-gray-300"
                } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={
                  showCustomPurpose
                    ? "Other (Please specify)"
                    : formData.purpose
                }
                onChange={handlePurposeChange}
              >
                <option value="">Select purpose</option>
                {documentTypeInfo.purpose_options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Custom purpose field */}
              {showCustomPurpose && (
                <div className="mt-3">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="customPurpose"
                  >
                    Specify Purpose <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="customPurpose"
                    name="customPurpose"
                    rows={2}
                    className={`appearance-none border ${
                      !customPurpose.trim()
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Please specify the purpose of your request"
                    value={customPurpose}
                    onChange={handleCustomPurposeChange}
                  />
                  {!customPurpose.trim() && (
                    <p className="text-red-500 text-xs mt-1">
                      Custom purpose is required
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            // If no predefined options, show a text field
            <input
              id="purpose"
              name="purpose"
              type="text"
              className={`appearance-none border ${
                errors.purpose ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder={`State your purpose for requesting this ${documentTypeInfo.title}`}
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
            />
          )}

          {errors.purpose && (
            <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
          )}
        </div>

        {/* Document-specific fields */}
        {documentTypeInfo.requiredFields.map((fieldName) =>
          renderInputField(fieldName)
        )}

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="mr-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Submitting...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default DocumentRequestForm;
