import React from "react";
import PendingVerifications from "../components/barangay/PendingVerifications";
import { FiCheckCircle } from "react-icons/fi";

const VerificationManagementPage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto pb-6">
      <div className="flex items-center mb-6">
        <FiCheckCircle className="text-2xl mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">
          Verification Management
        </h1>
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md">
        <h2 className="font-medium mb-2">About Account Verification</h2>
        <p>
          As a Barangay Captain or Secretary, you have the authority to verify
          resident accounts. Verified accounts confirm that the person is a
          legitimate resident of the barangay and allows them access to
          additional services.
        </p>
      </div>

      <PendingVerifications />
    </div>
  );
};

export default VerificationManagementPage;
