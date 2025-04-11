import { User } from "../context/AuthContext";
import { showErrorToast } from "../utils/toast";

const API_URL = "http://localhost:3000/api";

// Interface for dashboard statistics
export interface DashboardStats {
  total_users: number;
  gender_distribution: {
    male: number;
    female: number;
    other: number;
  };
  civil_status_distribution: {
    [key: string]: number;
  };
  age_distribution: {
    under18: number;
    age18to25: number;
    age26to35: number;
    age36to45: number;
    age46to60: number;
    over60: number;
  };
  top_barangays: Array<[string, number]>;
  top_cities: Array<[string, number]>;
  recent_registrations: User[];
}

class AdminService {
  // Get authentication token from local storage
  private getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to fetch users";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      showErrorToast(
        error instanceof Error ? error.message : "Network error occurred"
      );
      throw error;
    }
  }

  // Toggle admin status for a user
  async toggleAdminStatus(userId: number): Promise<User> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(
        `${API_URL}/admin/users/${userId}/toggle_admin`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to update admin status";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      showErrorToast(
        error instanceof Error ? error.message : "Network error occurred"
      );
      throw error;
    }
  }

  // Get user details
  async getUserDetails(userId: number): Promise<User> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to fetch user details";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      showErrorToast(
        error instanceof Error ? error.message : "Network error occurred"
      );
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to fetch dashboard statistics";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      showErrorToast(
        error instanceof Error ? error.message : "Network error occurred"
      );
      throw error;
    }
  }
}

export default new AdminService();
