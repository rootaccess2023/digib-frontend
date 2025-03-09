import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthState } from "../types/auth";
import toast from "react-hot-toast";

// Type Declarations
interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Check if user is already logged in (via token in localStorage)
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setAuthState((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const userData = await response.json();

        setAuthState({
          isAuthenticated: true,
          user: userData,
          loading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem("auth_token");
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: "Session expired, please login again",
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const token = data.token;

      if (!token) {
        throw new Error("No token received");
      }

      // Store auth token to localStorage
      localStorage.setItem("auth_token", token);

      // Success toast
      toast.success("Logged in successfully!");

      setAuthState({
        isAuthenticated: true,
        user: data.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Invalid email or password",
      }));
    }
  };

  const signup = async (
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            email,
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status?.message || "Signup failed");
      }

      const data = await response.json();
      const token = data.token;

      if (!token) {
        throw new Error("No token received");
      }

      // Store auth token to localStorage
      localStorage.setItem("auth_token", token);

      // Success toast
      toast.success("Account created successfully!");

      setAuthState({
        isAuthenticated: true,
        user: data.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Signup failed",
      }));
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("http://localhost:3000/api/logout", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Store auth token to localStorage
      localStorage.removeItem("auth_token");

      // Success toast
      toast.success("Logged out successfully!");

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      // Even if the logout fails on the server, clear local state
      localStorage.removeItem("auth_token");

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
