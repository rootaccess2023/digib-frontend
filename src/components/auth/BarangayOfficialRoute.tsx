import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { showErrorToast } from "../../utils/toast";

const BarangayOfficialRoute: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is a barangay official or admin
    if (!authState.loading) {
      if (!authState.isAuthenticated) {
        // Not authenticated, redirect to login
        showErrorToast("Please login to continue");
        navigate("/login", { replace: true });
      } else if (
        !authState.user?.admin &&
        !authState.user?.can_verify_accounts &&
        authState.user?.barangay_position === "none"
      ) {
        // Authenticated but not an admin or barangay official, redirect to dashboard
        showErrorToast("Barangay official access required");
        navigate("/dashboard", { replace: true });
      }
    }
  }, [authState.isAuthenticated, authState.loading, authState.user, navigate]);

  // Show loading state while checking authentication/admin status
  if (authState.loading) {
    return <div>Loading...</div>;
  }

  // Only render the outlet if authenticated and is admin or barangay official
  return authState.isAuthenticated &&
    (authState.user?.admin ||
      authState.user?.can_verify_accounts ||
      authState.user?.barangay_position !== "position_none") ? (
    <Outlet />
  ) : null;
};

export default BarangayOfficialRoute;
