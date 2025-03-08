import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if not authenticated and not loading
    if (!authState.isAuthenticated && !authState.loading) {
      navigate("/login", { replace: true });
    }
  }, [authState.isAuthenticated, authState.loading, navigate]);

  // Show loading state while checking authentication
  if (authState.loading) {
    return <div>Loading...</div>;
  }

  // Only render the outlet if authenticated
  return authState.isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
