import React, { useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiHelpCircle,
  FiClock,
  FiChevronDown,
} from "react-icons/fi";
import { User, VerificationStatus } from "../../context/AuthContext";
import BarangayAdminService from "../../services/BarangayAdminService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

interface VerificationStatusProps {
  user: User;
  canVerify: boolean;
  onUpdate: (updatedUser: User) => void;
}

const VerificationStatusComponent: React.FC<VerificationStatusProps> = ({
  user,
  canVerify,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Status display configurations
  const statusConfig = {
    [VerificationStatus.UNVERIFIED]: {
      icon: <FiHelpCircle className="text-gray-500" />,
      text: "Unverified",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
    },
    [VerificationStatus.PENDING]: {
      icon: <FiClock className="text-yellow-500" />,
      text: "Pending Verification",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    [VerificationStatus.VERIFIED]: {
      icon: <FiCheckCircle className="text-green-500" />,
      text: "Verified",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    [VerificationStatus.REJECTED]: {
      icon: <FiXCircle className="text-red-500" />,
      text: "Rejected",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
    },
  };

  const toggleDropdown = () => {
    if (!canVerify) return;
    setIsOpen(!isOpen);
  };

  const handleUpdateStatus = async (status: VerificationStatus) => {
    setLoading(true);
    try {
      const updatedUser = await BarangayAdminService.updateVerificationStatus(
        user.id,
        status
      );
      const statusText = statusConfig[status].text;
      showSuccessToast(`Verification status updated to ${statusText}`);
      onUpdate(updatedUser);
      setIsOpen(false);
    } catch (error) {
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Failed to update verification status"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get current status
  const currentStatus =
    (user.verification_status as VerificationStatus) ||
    VerificationStatus.UNVERIFIED;
  const config = statusConfig[currentStatus];

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        disabled={loading || !canVerify}
        className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
          config.bgColor
        } ${config.textColor} ${
          canVerify ? "hover:bg-opacity-80 cursor-pointer" : "cursor-default"
        }`}
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            Updating...
          </span>
        ) : (
          <>
            {config.icon && <span className="mr-1.5">{config.icon}</span>}
            <span>{config.text}</span>
            {canVerify && (
              <FiChevronDown
                className={`ml-1.5 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            )}
          </>
        )}
      </button>

      {isOpen && canVerify && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                onClick={() => handleUpdateStatus(status as VerificationStatus)}
                className={`w-full px-4 py-2 text-sm text-left flex items-center ${
                  status === currentStatus ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="mr-2">{config.icon}</span>
                <span
                  className={
                    status === VerificationStatus.VERIFIED
                      ? "text-green-700"
                      : status === VerificationStatus.REJECTED
                      ? "text-red-700"
                      : status === VerificationStatus.PENDING
                      ? "text-yellow-700"
                      : "text-gray-700"
                  }
                >
                  {config.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationStatusComponent;
