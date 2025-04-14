import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import BarangayOfficialRoute from "./components/auth/BarangayOfficialRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserManagementPage from "./pages/AdminUserManagementPage";
import VerificationManagementPage from "./pages/VerificationManagementPage";
import DocumentRequestsPage from "./pages/DocumentRequestsPage";
import DocumentManagementPage from "./pages/DocumentManagementPage";
import MainLayout from "./components/layout/MainLayout";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        {/* React Hot Toast Component */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes with MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* Dashboard route */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Document request routes */}
              <Route path="/documents" element={<DocumentRequestsPage />} />

              {/* Barangay Official routes */}
              <Route element={<BarangayOfficialRoute />}>
                <Route
                  path="/verification-management"
                  element={<VerificationManagementPage />}
                />
                <Route
                  path="/document-management"
                  element={<DocumentManagementPage />}
                />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route
                  path="/admin-dashboard"
                  element={<AdminDashboardPage />}
                />
                <Route
                  path="/admin-user-management"
                  element={<UserManagementPage />}
                />
              </Route>
            </Route>
          </Route>

          {/* Redirect to login by default */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
