import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
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
} from "react-icons/fi";
import EditProfileForm from "./profile/EditProfileForm";

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
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

  // If in edit mode, show the edit form
  if (isEditing) {
    return <EditProfileForm user={user} onCancel={handleCancelEdit} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center">
          <FiHome className="text-xl sm:text-2xl mr-2 sm:mr-3" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Dashboard
          </h1>
        </div>

        {/* Add Edit Profile button */}
        <button
          onClick={handleEditClick}
          className="flex items-center px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <FiEdit2 className="mr-2" />
          Edit Profile
        </button>
      </div>

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
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                {getFullName() || user?.email?.split("@")[0]}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base break-all sm:break-normal">
                {user?.email}
              </p>
              <div className="mt-2 flex justify-center sm:justify-start">
                {user?.admin ? (
                  <div className="flex items-center">
                    <FiUserCheck className="text-green-500 mr-2" />
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Administrator
                    </span>
                  </div>
                ) : (
                  <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    User
                  </span>
                )}
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

      {user?.admin && (
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-800">
              Admin Quick Links
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            <a
              href="/admin-dashboard"
              className="inline-flex items-center bg-black text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start mb-2 sm:mb-0 sm:mr-2"
            >
              <FiPieChart className="mr-2" />
              Admin Dashboard
            </a>

            <a
              href="/admin-user-management"
              className="inline-flex items-center bg-black text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <FiUser className="mr-2" />
              User Management
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
