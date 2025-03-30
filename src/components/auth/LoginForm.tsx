import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiUserPlus } from "react-icons/fi";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authState.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-md shadow-sm px-8 py-6"
      >
        {authState.error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"
            role="alert"
          >
            <span className="block">{authState.error}</span>
          </div>
        )}

        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              className="appearance-none border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              className="appearance-none border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors flex items-center"
            type="submit"
            disabled={authState.loading}
          >
            <FiLogIn className="mr-2" />
            {authState.loading ? "Logging in..." : "Sign in"}
          </button>

          <a
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
            href="/signup"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
          >
            <FiUserPlus className="mr-1" />
            Create account
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
