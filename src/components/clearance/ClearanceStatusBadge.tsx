import React from "react";
import {
  FiClock,
  FiActivity,
  FiCheck,
  FiXCircle,
  FiCheckCircle,
} from "react-icons/fi";

interface ClearanceStatusBadgeProps {
  status: "pending" | "processing" | "approved" | "rejected" | "completed";
}

const ClearanceStatusBadge: React.FC<ClearanceStatusBadgeProps> = ({
  status,
}) => {
  let bgColor = "";
  let textColor = "";
  let icon = null;
  let label = "";

  switch (status) {
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      icon = <FiClock className="mr-1" />;
      label = "Pending";
      break;
    case "processing":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      icon = <FiActivity className="mr-1" />;
      label = "Processing";
      break;
    case "approved":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <FiCheck className="mr-1" />;
      label = "Approved";
      break;
    case "completed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <FiCheckCircle className="mr-1" />;
      label = "Completed";
      break;
    case "rejected":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <FiXCircle className="mr-1" />;
      label = "Rejected";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      label = status;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {icon}
      {label}
    </span>
  );
};

export default ClearanceStatusBadge;
