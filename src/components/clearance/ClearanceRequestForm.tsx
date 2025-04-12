import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiAlertTriangle,
  FiSave,
  FiX,
  FiHelpCircle,
} from "react-icons/fi";
import ClearanceService, {
  ClearanceCreateData,
} from "../../services/ClearanceService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

interface ClearanceRequestFormProps {
  onCancel: () => void;
}

// Government ID types
const governmentIdTypes = [
  "Voter's ID",
  "UMID",
  "Driver's License",
  "PhilHealth ID",
  "Passport",
  "SSS ID",
  "Postal ID",
  "TIN ID",
  "Senior Citizen ID",
  "PWD ID",
  "National ID",
  "Other (Please specify in purpose)",
];

// Clearance purpose options
const purposeOptions = [
  "Employment requirement",
  "Business permit application",
  "Police clearance requirement",
  "Bank loan",
  "Scholarship application",
  "School requirement",
  "Local transaction",
  "Travel requirement",
  "NBI Clearance requirement",
  "Other (Please specify)",
];

const ClearanceRequestForm: React.FC<ClearanceRequestFormProps> = ({
  onCancel,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<ClearanceCreateData>({
    purpose: "",
    government_id_type: "",
    cedula_number: "",
    cedula_issued_date: "",
    cedula_issued_at: "",
  });

  // Custom purpose state (for "Other" option)
  const [customPurpose, setCustomPurpose] = useState("");
  const [showCustomPurpose, setShowCustomPurpose] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Special handling for purpose field
    if (name === "purpose") {
      if (value === "Other (Please specify)") {
        setShowCustomPurpose(true);
        setFormData({ ...formData, purpose: customPurpose });
      } else {
        setShowCustomPurpose(false);
        setFormData({ ...formData, purpose: value });
      }
      return;
    }

    // Handle custom purpose field
    if (name === "customPurpose") {
      setCustomPurpose(value);
      if (showCustomPurpose) {
        setFormData({ ...formData, purpose: value });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }

    if (!formData.government_id_type) {
      newErrors.government_id_type = "Government ID type is required";
    }

    if (!formData.cedula_number.trim()) {
      newErrors.cedula_number =
        "Cedula (Community Tax Certificate) number is required";
    }

    if (!formData.cedula_issued_date) {
      newErrors.cedula_issued_date = "Cedula issue date is required";
    }

    if (!formData.cedula_issued_at.trim()) {
      newErrors.cedula_issued_at = "Cedula issuing office is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await ClearanceService.createClearance(formData);
      showSuccessToast("Barangay clearance request submitted successfully");
      navigate("/clearances");
    } catch (error) {
      console.error("Failed to submit clearance request:", error);
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Failed to submit clearance request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiFileText className="mr-3" />
          Request Barangay Clearance
        </h1>

        <button
          onClick={onCancel}
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          <FiX className="mr-2" />
          Cancel
        </button>
      </div>

      {/* Information box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex">
          <FiAlertTriangle className="text-blue-500 text-xl flex-shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="text-blue-800 font-medium mb-2">
              Barangay Clearance Requirements
            </h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-1 text-sm">
              <li>Valid government-issued ID (with photo and address)</li>
              <li>
                Cedula (Community Tax Certificate) - obtainable from
                city/municipal hall
              </li>
              <li>
                Proof of residency (utility bill, lease agreement, or barangay
                certificate)
              </li>
              <li>Duly accomplished application form (this form)</li>
              <li>
                Personal appearance at the barangay hall (when picking up
                clearance)
              </li>
              <li>Payment of clearance fee (₱50.00)</li>
            </ul>
            <p className="mt-2 text-sm text-blue-700">
              Note: You must be a verified resident of the barangay for at least
              6 months.
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
            Purpose of Clearance <span className="text-red-500">*</span>
          </label>
          <select
            id="purpose"
            name="purpose"
            className={`appearance-none border ${
              errors.purpose ? "border-red-500" : "border-gray-300"
            } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            value={
              showCustomPurpose ? "Other (Please specify)" : formData.purpose
            }
            onChange={handleInputChange}
          >
            <option value="">Select purpose</option>
            {purposeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.purpose && (
            <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
          )}

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
                  !customPurpose.trim() ? "border-red-500" : "border-gray-300"
                } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Please specify the purpose of your clearance request"
                value={customPurpose}
                onChange={handleInputChange}
              />
              {!customPurpose.trim() && (
                <p className="text-red-500 text-xs mt-1">
                  Custom purpose is required
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="government_id_type"
          >
            Government ID Type <span className="text-red-500">*</span>
          </label>
          <select
            id="government_id_type"
            name="government_id_type"
            className={`appearance-none border ${
              errors.government_id_type ? "border-red-500" : "border-gray-300"
            } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            value={formData.government_id_type}
            onChange={handleInputChange}
          >
            <option value="">Select ID type</option>
            {governmentIdTypes.map((idType) => (
              <option key={idType} value={idType}>
                {idType}
              </option>
            ))}
          </select>
          {errors.government_id_type && (
            <p className="text-red-500 text-xs mt-1">
              {errors.government_id_type}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            <FiHelpCircle className="inline mr-1" />
            This is the type of ID you will present when claiming your clearance
          </p>
        </div>

        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="cedula_number"
          >
            Cedula (Community Tax Certificate) Number{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="cedula_number"
            name="cedula_number"
            type="text"
            className={`appearance-none border ${
              errors.cedula_number ? "border-red-500" : "border-gray-300"
            } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="e.g. 12345678"
            value={formData.cedula_number}
            onChange={handleInputChange}
          />
          {errors.cedula_number && (
            <p className="text-red-500 text-xs mt-1">{errors.cedula_number}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="cedula_issued_date"
            >
              Cedula Issue Date <span className="text-red-500">*</span>
            </label>
            <input
              id="cedula_issued_date"
              name="cedula_issued_date"
              type="date"
              className={`appearance-none border ${
                errors.cedula_issued_date ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.cedula_issued_date}
              onChange={handleInputChange}
            />
            {errors.cedula_issued_date && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cedula_issued_date}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="cedula_issued_at"
            >
              Cedula Issued At <span className="text-red-500">*</span>
            </label>
            <input
              id="cedula_issued_at"
              name="cedula_issued_at"
              type="text"
              className={`appearance-none border ${
                errors.cedula_issued_at ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. City Treasurer's Office, Manila"
              value={formData.cedula_issued_at}
              onChange={handleInputChange}
            />
            {errors.cedula_issued_at && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cedula_issued_at}
              </p>
            )}
          </div>
        </div>

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

export default ClearanceRequestForm;
