import React, { useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiShield,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";
import { User, BarangayPosition } from "../../context/AuthContext";
import BarangayAdminService from "../../services/BarangayAdminService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

interface PositionAssignmentProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const PositionAssignment: React.FC<PositionAssignmentProps> = ({
  user,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Position display names
  const positionDisplayNames = {
    [BarangayPosition.NONE]: "No Position",
    [BarangayPosition.BARANGAY_CAPTAIN]: "Barangay Captain",
    [BarangayPosition.BARANGAY_KAGAWAD]: "Barangay Kagawad",
    [BarangayPosition.SK_CHAIRPERSON]: "SK Chairperson",
    [BarangayPosition.BARANGAY_SECRETARY]: "Barangay Secretary",
    [BarangayPosition.BARANGAY_TREASURER]: "Barangay Treasurer",
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAssignPosition = async (position: BarangayPosition) => {
    setLoading(true);
    try {
      const updatedUser = await BarangayAdminService.assignPosition(
        user.id,
        position
      );
      showSuccessToast(
        `Position updated to ${
          positionDisplayNames[position as keyof typeof positionDisplayNames]
        }`
      );
      onUpdate(updatedUser);
      setIsOpen(false);
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Failed to assign position"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get the current position display name
  const currentPosition =
    positionDisplayNames[
      (user.barangay_position as keyof typeof positionDisplayNames) ||
        BarangayPosition.NONE
    ];

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        disabled={loading}
        className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
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
            <FiUsers className="mr-1" />
            <span className="mr-1">{currentPosition}</span>
            <FiChevronDown
              className={`ml-1 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            {Object.entries(positionDisplayNames).map(
              ([position, displayName]) => (
                <button
                  key={position}
                  onClick={() =>
                    handleAssignPosition(position as BarangayPosition)
                  }
                  className={`w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center ${
                    user.barangay_position === position ? "bg-gray-50" : ""
                  }`}
                >
                  {position === BarangayPosition.NONE ? (
                    <FiUsers className="mr-2 text-gray-400" />
                  ) : position === BarangayPosition.BARANGAY_CAPTAIN ? (
                    <FiShield className="mr-2 text-yellow-500" />
                  ) : (
                    <FiUserCheck className="mr-2 text-blue-500" />
                  )}
                  {displayName}
                  {user.barangay_position === position && (
                    <FiCheck className="ml-auto text-green-500" />
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionAssignment;
