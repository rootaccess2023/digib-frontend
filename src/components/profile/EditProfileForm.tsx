import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiPhone,
  FiMap,
  FiSave,
  FiX,
} from "react-icons/fi";
import { User, ResidentialAddress } from "../../context/AuthContext";
import { useAuth } from "../../context/AuthContext";
import UserService from "../../services/UserService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

interface EditProfileFormProps {
  user: User | null;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onCancel,
}) => {
  const { authState } = useAuth();

  // Create form state from user data
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    middle_name: user?.middle_name || "",
    last_name: user?.last_name || "",
    name_extension: user?.name_extension || "",
    date_of_birth: user?.date_of_birth || "",
    gender: user?.gender || "",
    civil_status: user?.civil_status || "",
    mobile_phone: user?.mobile_phone || "",
    residential_address: {
      house_number: user?.residential_address?.house_number || "",
      street_name: user?.residential_address?.street_name || "",
      purok: user?.residential_address?.purok || "",
      barangay: user?.residential_address?.barangay || "",
      city: user?.residential_address?.city || "",
      province: user?.residential_address?.province || "",
    },
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle input changes for main form fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle input changes for residential address fields
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      residential_address: {
        ...formData.residential_address,
        [name]: value,
      },
    });
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required fields
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.date_of_birth)
      newErrors.date_of_birth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.civil_status)
      newErrors.civil_status = "Civil status is required";

    // Address required fields
    if (!formData.residential_address.barangay.trim())
      newErrors.barangay = "Barangay is required";
    if (!formData.residential_address.city.trim())
      newErrors.city = "City/Municipality is required";
    if (!formData.residential_address.province.trim())
      newErrors.province = "Province is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Call the update profile API
      await UserService.updateProfile(formData);

      showSuccessToast("Profile updated successfully");
      onCancel(); // Return to dashboard after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Edit Profile
        </h1>
        <button
          onClick={onCancel}
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          <FiX className="mr-2" />
          Cancel
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-md shadow-sm border border-gray-200 p-6"
      >
        {/* Personal Information Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="first_name"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  className={`appearance-none border ${
                    errors.first_name ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Juan"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="middle_name"
              >
                Middle Name <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  className="appearance-none border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  id="middle_name"
                  name="middle_name"
                  type="text"
                  placeholder="Magsaysay"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="last_name"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  className={`appearance-none border ${
                    errors.last_name ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Dela Cruz"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="name_extension"
              >
                Name Extension <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  className="appearance-none border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  id="name_extension"
                  name="name_extension"
                  type="text"
                  placeholder="Jr., Sr., III"
                  value={formData.name_extension}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="date_of_birth"
            >
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                className={`appearance-none border ${
                  errors.date_of_birth ? "border-red-500" : "border-gray-300"
                } rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </div>
            {errors.date_of_birth && (
              <p className="text-red-500 text-xs mt-1">
                {errors.date_of_birth}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="gender"
              >
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`appearance-none border ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="civil_status"
              >
                Civil Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`appearance-none border ${
                    errors.civil_status ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                  id="civil_status"
                  name="civil_status"
                  value={formData.civil_status}
                  onChange={handleInputChange}
                >
                  <option value="">Select Civil Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                  <option value="divorced">Divorced</option>
                </select>
              </div>
              {errors.civil_status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.civil_status}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="mobile_phone"
            >
              Mobile Phone Number{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="text-gray-400" />
              </div>
              <input
                className="appearance-none border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                id="mobile_phone"
                name="mobile_phone"
                type="tel"
                placeholder="09123456789"
                value={formData.mobile_phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Residential Address Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Residential Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="house_number"
              >
                House/Lot Number{" "}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                className="appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                id="house_number"
                name="house_number"
                type="text"
                placeholder="123"
                value={formData.residential_address.house_number}
                onChange={handleAddressChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="street_name"
              >
                Street Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                className="appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                id="street_name"
                name="street_name"
                type="text"
                placeholder="Rizal Street"
                value={formData.residential_address.street_name}
                onChange={handleAddressChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="purok"
            >
              Purok/Zone <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              className="appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              id="purok"
              name="purok"
              type="text"
              placeholder="Purok 1"
              value={formData.residential_address.purok}
              onChange={handleAddressChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="barangay"
            >
              Barangay <span className="text-red-500">*</span>
            </label>
            <input
              className={`appearance-none border ${
                errors.barangay ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
              id="barangay"
              name="barangay"
              type="text"
              placeholder="Barangay 123"
              value={formData.residential_address.barangay}
              onChange={handleAddressChange}
            />
            {errors.barangay && (
              <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="city"
            >
              City/Municipality <span className="text-red-500">*</span>
            </label>
            <input
              className={`appearance-none border ${
                errors.city ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
              id="city"
              name="city"
              type="text"
              placeholder="Manila"
              value={formData.residential_address.city}
              onChange={handleAddressChange}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="province"
            >
              Province <span className="text-red-500">*</span>
            </label>
            <input
              className={`appearance-none border ${
                errors.province ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
              id="province"
              name="province"
              type="text"
              placeholder="Metro Manila"
              value={formData.residential_address.province}
              onChange={handleAddressChange}
            />
            {errors.province && (
              <p className="text-red-500 text-xs mt-1">{errors.province}</p>
            )}
          </div>
        </div>

        {/* Email display - readonly */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Account Information
          </h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email Address{" "}
              <span className="text-gray-500">(Cannot be changed)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                className="appearance-none border border-gray-300 bg-gray-100 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight"
                id="email"
                name="email"
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
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
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
