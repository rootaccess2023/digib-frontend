import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUserPlus,
  FiLogIn,
  FiUser,
  FiCalendar,
  FiPhone,
} from "react-icons/fi";

// Types for our form
interface ResidentialAddress {
  house_number: string;
  street_name: string;
  purok: string;
  barangay: string;
  city: string;
  province: string;
}

interface SignupFormData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  name_extension: string;
  date_of_birth: string;
  gender: string;
  civil_status: string;
  mobile_phone: string;
  residential_address: ResidentialAddress;
}

const SignupForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    name_extension: "",
    date_of_birth: "",
    gender: "",
    civil_status: "",
    mobile_phone: "",
    residential_address: {
      house_number: "",
      street_name: "",
      purok: "",
      barangay: "",
      city: "",
      province: "",
    },
  });

  // Form validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Current form step
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Auth context
  const { signup, authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authState.isAuthenticated, navigate]);

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

  // Validate form data based on current step
  const validateForm = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.first_name.trim())
        newErrors.first_name = "First name is required";
      if (!formData.last_name.trim())
        newErrors.last_name = "Last name is required";
      if (!formData.date_of_birth)
        newErrors.date_of_birth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.civil_status)
        newErrors.civil_status = "Civil status is required";
    } else if (step === 2) {
      if (!formData.residential_address.barangay.trim())
        newErrors.barangay = "Barangay is required";
      if (!formData.residential_address.city.trim())
        newErrors.city = "City/Municipality is required";
      if (!formData.residential_address.province.trim())
        newErrors.province = "Province is required";
    } else if (step === 3) {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";

      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";

      if (formData.password !== formData.password_confirmation)
        newErrors.password_confirmation = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(3)) return;

    try {
      await signup(formData);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  // Move to the next step
  const handleNextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to the previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Render personal information form (Step 1)
  const renderPersonalInfoForm = () => (
    <>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Personal Information
      </h3>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <p className="text-red-500 text-xs mt-1">{errors.civil_status}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-medium mb-2"
          htmlFor="mobile_phone"
        >
          Mobile Phone Number <span className="text-gray-400">(Optional)</span>
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
    </>
  );

  // Render residential address form (Step 2)
  const renderAddressForm = () => (
    <>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Residential Address
      </h3>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="house_number"
          >
            House/Lot Number <span className="text-gray-400">(Optional)</span>
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
    </>
  );

  // Render account information form (Step 3)
  const renderAccountForm = () => (
    <>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Account Information
      </h3>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-medium mb-2"
          htmlFor="email"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-gray-400" />
          </div>
          <input
            className={`appearance-none border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-medium mb-2"
          htmlFor="password"
        >
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="text-gray-400" />
          </div>
          <input
            className={`appearance-none border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-medium mb-2"
          htmlFor="password_confirmation"
        >
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="text-gray-400" />
          </div>
          <input
            className={`appearance-none border ${
              errors.password_confirmation
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            placeholder="••••••••"
            value={formData.password_confirmation}
            onChange={handleInputChange}
          />
        </div>
        {errors.password_confirmation && (
          <p className="text-red-500 text-xs mt-1">
            {errors.password_confirmation}
          </p>
        )}
      </div>
    </>
  );

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-md shadow-sm px-6 py-6"
      >
        {authState.error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"
            role="alert"
          >
            <span className="block">{authState.error}</span>
          </div>
        )}

        {/* Form steps progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <React.Fragment key={index}>
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      index + 1 < currentStep
                        ? "bg-black text-white"
                        : index + 1 === currentStep
                        ? "bg-black text-white border-2 border-gray-200"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1 < currentStep ? "✓" : index + 1}
                  </div>
                  <span className="text-xs mt-1 text-gray-500">
                    {index === 0
                      ? "Personal"
                      : index === 1
                      ? "Address"
                      : "Account"}
                  </span>
                </div>

                {/* Connector line between circles (except after the last one) */}
                {index < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index + 1 < currentStep ? "bg-black" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form content based on current step */}
        <div className="mb-6">
          {currentStep === 1 && renderPersonalInfoForm()}
          {currentStep === 2 && renderAddressForm()}
          {currentStep === 3 && renderAccountForm()}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              Back
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors ml-auto"
            >
              Next
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <a
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                <FiLogIn className="mr-1" />
                Sign in instead
              </a>

              <button
                className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors flex items-center"
                type="submit"
                disabled={authState.loading}
              >
                <FiUserPlus className="mr-2" />
                {authState.loading ? "Creating account..." : "Sign up"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
