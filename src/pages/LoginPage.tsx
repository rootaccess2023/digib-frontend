import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Log in to your account
        </h2>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
