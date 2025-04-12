import { showErrorToast } from "../utils/toast";

const API_URL = "http://localhost:3000/api";

// Type for Barangay Clearance
export interface BarangayClearance {
  id: number;
  reference_number: string;
  purpose: string;
  status: "pending" | "processing" | "approved" | "rejected" | "completed";
  remarks?: string;
  fee_amount: number;
  fee_paid: boolean;
  government_id_type: string;
  cedula_number: string;
  cedula_issued_date: string;
  cedula_issued_at: string;
  created_at: string;
  updated_at: string;
  approved_by?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  approved_at?: string;
  rejected_by?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  rejected_at?: string;
  user?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  days_ago: number;
}

// Type for clearance creation data
export interface ClearanceCreateData {
  purpose: string;
  government_id_type: string;
  cedula_number: string;
  cedula_issued_date: string;
  cedula_issued_at: string;
}

class ClearanceService {
  // Get authentication token from local storage
  private getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  // Get all clearances for the current user
  async getUserClearances(): Promise<BarangayClearance[]> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/clearances`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to fetch clearances";
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

  // Get all clearances (admin/official only)
  async getAllClearances(status?: string): Promise<BarangayClearance[]> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      let url = `${API_URL}/clearances/all`;
      if (status) {
        url += `?status=${status}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to fetch clearances";
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

  // Get a single clearance by ID
  async getClearance(id: number): Promise<BarangayClearance> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/clearances/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to fetch clearance";
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

  // Create a new clearance request
  async createClearance(data: ClearanceCreateData): Promise<BarangayClearance> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/clearances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clearance: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to create clearance request";
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

  // Update a clearance status (admin/official only)
  async updateClearanceStatus(
    id: number,
    status: string,
    remarks?: string
  ): Promise<BarangayClearance> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/clearances/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, remarks }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to update clearance status";
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

  // Update clearance details (only for pending status)
  async updateClearance(
    id: number,
    data: Partial<ClearanceCreateData>
  ): Promise<BarangayClearance> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/clearances/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clearance: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to update clearance";
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

  // Delete a clearance request (only for pending status)
  async deleteClearance(id: number): Promise<void> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/clearances/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to delete clearance";
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

export default new ClearanceService();
