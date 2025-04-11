import { User } from "../context/AuthContext";
import { showErrorToast } from "../utils/toast";

const API_URL = "http://localhost:3000/api";

// Type for profile update data
export interface ProfileUpdateData {
  first_name: string;
  middle_name: string;
  last_name: string;
  name_extension: string;
  date_of_birth: string;
  gender: string;
  civil_status: string;
  mobile_phone: string;
  residential_address: {
    house_number: string;
    street_name: string;
    purok: string;
    barangay: string;
    city: string;
    province: string;
  };
}

class UserService {
  // Get authentication token from local storage
  private getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  // Update user profile
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/users/update_profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to update profile";
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

  // Change password
  async changePassword(
    current_password: string,
    password: string,
    password_confirmation: string
  ): Promise<void> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/users/change_password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: {
            current_password,
            password,
            password_confirmation,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to change password";
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      return;
    } catch (error) {
      console.error("API Error:", error);
      showErrorToast(
        error instanceof Error ? error.message : "Network error occurred"
      );
      throw error;
    }
  }
}

export default new UserService();
