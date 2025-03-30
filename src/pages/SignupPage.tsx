import { FiBox } from "react-icons/fi";
import SignupForm from "../components/auth/SignupForm";

const SignupPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="h-14 w-14 rounded-md bg-black mx-auto flex items-center justify-center mb-4">
            <FiBox className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600">
            Join us to access your personalized dashboard
          </p>
        </div>

        <div className="mt-8">
          <SignupForm />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By creating an account, you agree to our{" "}
            <a href="#" className="font-medium text-gray-900 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-gray-900 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
