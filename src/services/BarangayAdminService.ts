import { User } from "../context/AuthContext";
import { showErrorToast } from "../utils/toast";

const API_URL = "http://localhost:3000/api";

// Type for available barangay positions
export enum BarangayPosition {
  NONE = "none",
  BARANGAY_CAPTAIN = "barangay_captain",
  BARANGAY_KAGAWAD = "barangay_kagawad",
  SK_CHAIRPERSON = "sk_chairperson",
  BARANGAY_SECRETARY = "barangay_secretary",
  BARANGAY_TREASURER = "barangay_treasurer",
}

// Type for verification status
export enum VerificationStatus {
  UNVERIFIED = "unverified",
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

class BarangayAdminService {
  // Get authentication token from local storage
  private getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  // Assign barangay position to a user
  async assignPosition(
    userId: number,
    position: BarangayPosition
  ): Promise<User> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(
        `${API_URL}/barangay/users/${userId}/assign_position`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: {
              barangay_position: position,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to assign position";
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

  // Update user verification status
  async updateVerificationStatus(
    userId: number,
    status: VerificationStatus
  ): Promise<User> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(
        `${API_URL}/barangay/users/${userId}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: {
              verification_status: status,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to update verification status";
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

  // Get pending verifications
  async getPendingVerifications(): Promise<User[]> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(
        `${API_URL}/barangay/pending_verifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to fetch pending verifications";
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

export default new BarangayAdminService();
