import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, VerificationStatus } from "../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiKey,
  FiUserCheck,
  FiHome,
  FiMapPin,
  FiCalendar,
  FiPhone,
  FiEdit2,
  FiPieChart,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiHelpCircle,
  FiShield,
  FiUserPlus,
  FiFileText,
} from "react-icons/fi";
import EditProfileForm from "./profile/EditProfileForm";
import VerificationRequest from "./barangay/VerificationRequest";

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const user = authState.user;

  // Add state to control edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Format date of birth if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get full name
  const getFullName = () => {
    if (!user) return "";

    const parts = [
      user.first_name || "",
      user.middle_name || "",
      user.last_name || "",
      user.name_extension ? `, ${user.name_extension}` : "",
    ];

    return parts.join(" ").replace(/\s+/g, " ").trim();
  };

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Navigate to clearance request
  const handleClearanceRequest = () => {
    navigate("/clearances");
  };

  // Handle user update (for verification request)
  const handleUserUpdate = (updatedUser: typeof user) => {
    // Force a re-render by reloading the page
    window.location.reload();
  };

  // Get verification status badge config
  const getVerificationBadge = () => {
    const status = user?.verification_status || VerificationStatus.UNVERIFIED;

    switch (status) {
      case VerificationStatus.VERIFIED:
        return {
          icon: <FiCheckCircle className="text-green-500" />,
          text: "Verified Account",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case VerificationStatus.PENDING:
        return {
          icon: <FiClock className="text-yellow-500" />,
          text: "Verification Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
      case VerificationStatus.REJECTED:
        return {
          icon: <FiXCircle className="text-red-500" />,
          text: "Verification Rejected",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: <FiHelpCircle className="text-gray-500" />,
          text: "Unverified Account",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
        };
    }
  };

  // Get barangay position display
  const getBarangayPositionDisplay = () => {
    if (
      !user?.barangay_position ||
      user.barangay_position === "position_none"
    ) {
      return null;
    }

    const positionMap: {
      [key: string]: { title: string; icon: React.ReactNode };
    } = {
      barangay_captain: {
        title: "Barangay Captain (Punong Barangay)",
        icon: <FiShield className="text-yellow-500" />,
      },
      barangay_kagawad: {
        title: "Barangay Kagawad",
        icon: <FiUserCheck className="text-blue-500" />,
      },
      sk_chairperson: {
        title: "SK Chairperson",
        icon: <FiUserPlus className="text-purple-500" />,
      },
      barangay_secretary: {
        title: "Barangay Secretary",
        icon: <FiMail className="text-green-500" />,
      },
      barangay_treasurer: {
        title: "Barangay Treasurer",
        icon: <FiKey className="text-red-500" />,
      },
    };

    const position = positionMap[user.barangay_position];

    if (!position) return null;

    return (
      <div className="flex items-center">
        {position.icon}
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ml-2">
          {position.title}
        </span>
      </div>
    );
  };

  // If in edit mode, show the edit form
  if (isEditing) {
    return <EditProfileForm user={user} onCancel={handleCancelEdit} />;
  }

  const verificationBadge = getVerificationBadge();

  return (
    <div className="w-full max-w-6xl mx-auto pb-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center">
          <FiHome className="text-xl sm:text-2xl mr-2 sm:mr-3" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Dashboard
          </h1>
        </div>

        <div className="flex space-x-3">
          {/* Add Request Clearance button */}
          {user?.verification_status === VerificationStatus.VERIFIED && (
            <button
              onClick={handleClearanceRequest}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiFileText className="mr-2" />
              Request Clearance
            </button>
          )}

          {/* Edit Profile button */}
          <button
            onClick={handleEditClick}
            className="flex items-center px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <FiEdit2 className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Verification Request for unverified users */}
      {user?.verification_status === VerificationStatus.PENDING && (
        <div className="mb-4 sm:mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-start">
              <FiClock className="text-yellow-500 mt-0.5 mr-3 text-xl flex-shrink-0" />
              <div>
                <h5 className="font-medium mb-2">
                  Your account is pending verification
                </h5>
                <p className="text-sm text-gray-600">
                  Your account is waiting for verification by a barangay
                  official. This process may take some time. You will be
                  notified when your account is verified.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clearance Request CTA for unverified users */}
      {user?.verification_status !== VerificationStatus.VERIFIED &&
        user?.verification_status !== VerificationStatus.PENDING && (
          <div className="mb-4 sm:mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start">
                <FiFileText className="text-blue-500 mt-0.5 mr-3 text-xl flex-shrink-0" />
                <div>
                  <h5 className="font-medium mb-2">
                    Verify your account to request barangay clearances
                  </h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Your account needs to be verified before you can request
                    barangay clearances. Verification confirms you are a
                    legitimate resident of the barangay.
                  </p>
                  <a
                    href="/verification-request"
                    className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900"
                  >
                    <FiCheckCircle className="mr-1.5" />
                    Request Verification
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 mb-4 sm:mb-6">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg font-medium text-gray-800">
            User Information
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row mb-4 sm:mb-6">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-600 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 mx-auto sm:mx-0">
              <span className="text-xl sm:text-2xl font-semibold text-white">
                {user?.first_name?.charAt(0) ||
                  user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                {getFullName() || user?.email?.split("@")[0]}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base break-all sm:break-normal">
                {user?.email}
              </p>
              <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                {user?.admin && (
                  <div className="flex items-center">
                    <FiUserCheck className="text-green-500 mr-2" />
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Administrator
                    </span>
                  </div>
                )}

                {getBarangayPositionDisplay()}

                <div
                  className={`flex items-center ${verificationBadge.bgColor} ${verificationBadge.textColor} px-3 py-1 rounded-full border ${verificationBadge.borderColor}`}
                >
                  {verificationBadge.icon}
                  <span className="ml-1.5 text-xs sm:text-sm font-medium">
                    {verificationBadge.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-md p-3 sm:p-4">
                <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                  <FiUser className="mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Full Name
                  </span>
                </div>
                <p className="text-gray-900 text-sm sm:text-base">
                  {getFullName() || "Not provided"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-md p-3 sm:p-4">
                <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                  <FiCalendar className="mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Date of Birth
                  </span>
                </div>
                <p className="text-gray-900 text-sm sm:text-base">
                  {formatDate(user?.date_of_birth)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-md p-3 sm:p-4">
                <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                  <FiUser className="mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Gender
                  </span>
                </div>
                <p className="text-gray-900 text-sm sm:text-base capitalize">
                  {user?.gender || "Not provided"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-md p-3 sm:p-4">
                <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                  <FiUser className="mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Civil Status
                  </span>
                </div>
                <p className="text-gray-900 text-sm sm:text-base capitalize">
                  {user?.civil_status || "Not provided"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-md p-3 sm:p-4">
                <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                  <FiPhone className="mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Mobile Phone
                  </span>
                </div>
                <p className="text-gray-900 text-sm sm:text-base">
                  {user?.mobile_phone || "Not provided"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-md p-3 sm:p-4">
                <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                  <FiMail className="mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Email Address
                  </span>
                </div>
                <p className="text-gray-900 text-sm sm:text-base break-all">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Section - only show if verification status is pending or rejected */}
          {(user?.verification_status === VerificationStatus.PENDING ||
            user?.verification_status === VerificationStatus.REJECTED) && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">
                Account Verification
              </h4>
              <div
                className={`p-4 rounded-md border ${
                  user.verification_status === VerificationStatus.PENDING
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start">
                  {user.verification_status === VerificationStatus.PENDING ? (
                    <FiClock className="text-yellow-500 mt-0.5 mr-3 text-xl flex-shrink-0" />
                  ) : (
                    <FiXCircle className="text-red-500 mt-0.5 mr-3 text-xl flex-shrink-0" />
                  )}
                  <div>
                    <h5 className="font-medium mb-2">
                      {user.verification_status === VerificationStatus.PENDING
                        ? "Your verification request is pending"
                        : "Your verification request was rejected"}
                    </h5>
                    <p className="text-sm text-gray-600 mb-2">
                      {user.verification_status === VerificationStatus.PENDING
                        ? "Your account verification request is being reviewed by a barangay official. This process may take some time. You will be notified when your account is verified."
                        : "Your verification request was rejected. You may need to update your information or contact the barangay office for more details."}
                    </p>
                    {user.verification_status ===
                      VerificationStatus.REJECTED && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-2 bg-black text-white px-3 py-1 text-sm rounded-md hover:bg-gray-800 transition-colors inline-flex items-center"
                      >
                        <FiEdit2 className="mr-1.5" />
                        Update Profile Information
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address Section */}
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">
              Residential Address
            </h4>
            <div className="bg-gray-50 rounded-md p-3 sm:p-4">
              <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                <FiMapPin className="mr-2 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">
                  Complete Address
                </span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base">
                {user?.residential_address ? (
                  <>
                    {[
                      user.residential_address.house_number,
                      user.residential_address.street_name,
                      user.residential_address.purok &&
                        `Purok ${user.residential_address.purok}`,
                      user.residential_address.barangay &&
                        `Barangay ${user.residential_address.barangay}`,
                      user.residential_address.city,
                      user.residential_address.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </>
                ) : (
                  "No address provided"
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-md p-3 sm:p-4">
              <div className="flex items-center text-gray-700 mb-1 sm:mb-2">
                <FiKey className="mr-2 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">
                  User ID
                </span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base break-all">
                {user?.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Official Actions Section */}
      {(user?.admin || user?.barangay_position !== "none") && (
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-800">
              {user.admin ? "Admin Actions" : "Barangay Official Actions"}
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user?.admin && (
                <>
                  <a
                    href="/admin-dashboard"
                    className="flex items-center bg-black text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base justify-center"
                  >
                    <FiPieChart className="mr-2" />
                    Admin Dashboard
                  </a>

                  <a
                    href="/admin-user-management"
                    className="flex items-center bg-black text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base justify-center"
                  >
                    <FiUsers className="mr-2" />
                    User Management
                  </a>
                </>
              )}

              {user?.can_verify_accounts && (
                <a
                  href="/verification-management"
                  className="flex items-center bg-black text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base justify-center"
                >
                  <FiCheckCircle className="mr-2" />
                  Verify Accounts
                </a>
              )}

              {/* Add Clearance Management link */}
              {(user?.barangay_position !== "none" || user?.admin) && (
                <>
                  <a
                    href="/clearance-management"
                    className="flex items-center bg-black text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base justify-center"
                  >
                    <FiFileText className="mr-2" />
                    Manage Clearances
                  </a>

                  <a
                    href="/residents"
                    className="flex items-center bg-black text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base justify-center"
                  >
                    <FiUsers className="mr-2" />
                    Residents
                  </a>

                  <a
                    href="/documents"
                    className="flex items-center bg-black text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base justify-center"
                  >
                    <FiFileText className="mr-2" />
                    Documents
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
