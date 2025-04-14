import { showErrorToast } from "../utils/toast";

const API_URL = "http://localhost:3000/api";

export enum DocumentType {
  BARANGAY_CLEARANCE = "barangay_clearance",
  CERTIFICATE_OF_RESIDENCY = "certificate_of_residency",
  CERTIFICATE_OF_INDIGENCY = "certificate_of_indigency",
  BARANGAY_ID = "barangay_id",
  CERTIFICATE_OF_GOOD_MORAL = "certificate_of_good_moral_character",
  ENDORSEMENT_LETTER = "endorsement_letter",
  BLOTTER_RECORD = "blotter_record",
  BUSINESS_CLEARANCE = "business_clearance",
}

// Type for Document Request
export interface DocumentRequest {
  id: number;
  reference_number: string;
  document_type: DocumentType;
  purpose: string;
  status: "pending" | "processing" | "approved" | "rejected" | "completed";
  remarks?: string;
  fee_amount: number;
  fee_paid: boolean;
  document_data: any;
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

// Type for document creation data
export interface DocumentCreateData {
  document_type: DocumentType;
  purpose: string;
  document_data: any; // Document-specific data
}

// Document metadata
export interface DocumentTypeInfo {
  type: DocumentType;
  title: string;
  description: string;
  icon: string;
  fee: number;
  requirements: string[];
  requiredFields: string[];
  purpose_options?: string[];
}

// Document type definitions with metadata
export const DOCUMENT_TYPES: { [key in DocumentType]: DocumentTypeInfo } = {
  [DocumentType.BARANGAY_CLEARANCE]: {
    type: DocumentType.BARANGAY_CLEARANCE,
    title: "Barangay Clearance",
    description:
      "Official document certifying you are a resident in good standing with the barangay.",
    icon: "FiFileText",
    fee: 50.0,
    requirements: [
      "Valid government-issued ID (with photo and address)",
      "Cedula (Community Tax Certificate)",
      "Proof of residency",
      "Personal appearance at the barangay hall",
      "Payment of clearance fee",
    ],
    requiredFields: [
      "government_id_type",
      "cedula_number",
      "cedula_issued_date",
      "cedula_issued_at",
    ],
    purpose_options: [
      "Employment requirement",
      "Business permit application",
      "Police clearance requirement",
      "Bank loan",
      "Scholarship application",
      "School requirement",
      "Local transaction",
      "Travel requirement",
      "NBI Clearance requirement",
      "Other (Please specify)",
    ],
  },
  [DocumentType.CERTIFICATE_OF_RESIDENCY]: {
    type: DocumentType.CERTIFICATE_OF_RESIDENCY,
    title: "Certificate of Residency",
    description:
      "Certifies that you are a legitimate resident of the barangay.",
    icon: "FiHome",
    fee: 30.0,
    requirements: [
      "Valid ID showing barangay address",
      "Proof of residency (e.g. electric/water bill)",
      "Cedula",
      "Filled-out request form",
      "Minimal fee",
    ],
    requiredFields: ["resident_since_date", "address_proof_type"],
    purpose_options: [
      "School enrollment",
      "Court requirement",
      "Immigration requirement",
      "Public utility application",
      "Government program application",
      "Other (Please specify)",
    ],
  },
  [DocumentType.CERTIFICATE_OF_INDIGENCY]: {
    type: DocumentType.CERTIFICATE_OF_INDIGENCY,
    title: "Certificate of Indigency",
    description:
      "Certifies that you are from a low-income family and eligible for assistance.",
    icon: "FiDollarSign",
    fee: 0.0,
    requirements: [
      "Valid ID",
      "Barangay form",
      "Declaration of purpose",
      "Cedula (optional)",
      "Supporting documents (e.g. hospital bill)",
    ],
    requiredFields: [
      "monthly_family_income",
      "number_of_dependents",
      "assistance_purpose",
    ],
    purpose_options: [
      "Medical assistance",
      "Financial assistance",
      "Scholarship application",
      "Legal aid application",
      "DSWD assistance",
      "PCSO assistance",
      "Hospital bill discount",
      "Other (Please specify)",
    ],
  },
  [DocumentType.BARANGAY_ID]: {
    type: DocumentType.BARANGAY_ID,
    title: "Barangay ID",
    description: "Local identification within the barangay or community.",
    icon: "FiCreditCard",
    fee: 75.0,
    requirements: [
      "Valid ID or Birth Certificate",
      "Proof of residency",
      "1-2 pcs of ID photo (white background)",
      "Filled-out application form",
      "Barangay Clearance",
      "Payment",
    ],
    requiredFields: [
      "id_photo_provided",
      "resident_since_date",
      "emergency_contact_name",
      "emergency_contact_number",
    ],
    purpose_options: [
      "Local identification",
      "Delivery receiving",
      "Resident-only benefits",
      "Other (Please specify)",
    ],
  },
  [DocumentType.CERTIFICATE_OF_GOOD_MORAL]: {
    type: DocumentType.CERTIFICATE_OF_GOOD_MORAL,
    title: "Certificate of Good Moral Character",
    description: "Attests to your good standing and behavior in the community.",
    icon: "FiUserCheck",
    fee: 50.0,
    requirements: [
      "Valid ID",
      "Cedula",
      "Letter stating purpose",
      "No derogatory record in barangay",
      "Optional: endorsement from barangay official",
      "Payment",
    ],
    requiredFields: [
      "years_of_residency",
      "character_reference_name",
      "character_reference_contact",
    ],
    purpose_options: [
      "Employment requirement",
      "School enrollment",
      "Scholarship application",
      "Legal case",
      "NBI clearance requirement",
      "Immigration requirement",
      "Other (Please specify)",
    ],
  },
  [DocumentType.ENDORSEMENT_LETTER]: {
    type: DocumentType.ENDORSEMENT_LETTER,
    title: "Endorsement/Referral Letter",
    description:
      "Official referral to other government offices or institutions.",
    icon: "FiSend",
    fee: 0.0,
    requirements: [
      "Valid ID",
      "Request letter or verbal request",
      "Supporting documents",
      "Barangay Clearance (sometimes required)",
    ],
    requiredFields: [
      "addressed_to",
      "endorsement_reason",
      "supporting_documents_description",
    ],
    purpose_options: [
      "Medical aid referral",
      "Financial assistance referral",
      "Legal assistance referral",
      "DSWD referral",
      "PAO referral",
      "Hospital referral",
      "NGO referral",
      "Other (Please specify)",
    ],
  },
  [DocumentType.BLOTTER_RECORD]: {
    type: DocumentType.BLOTTER_RECORD,
    title: "Blotter Record/Incident Report",
    description:
      "Official record of an incident or complaint filed with the barangay.",
    icon: "FiAlertTriangle",
    fee: 75.0,
    requirements: [
      "Valid ID",
      "Written request or fill-out form",
      "Details of incident",
      "Authorization letter (if not a party)",
      "Payment for copy",
    ],
    requiredFields: [
      "incident_date",
      "incident_location",
      "persons_involved",
      "incident_details",
      "blotter_entry_number",
      "resolution_status",
    ],
    purpose_options: [
      "Legal proceedings",
      "Complaint resolution",
      "Insurance claim",
      "Employment clearance",
      "Immigration clearance",
      "Other (Please specify)",
    ],
  },
  [DocumentType.BUSINESS_CLEARANCE]: {
    type: DocumentType.BUSINESS_CLEARANCE,
    title: "Barangay Business Clearance",
    description:
      "Required for registering or renewing a business within the barangay.",
    icon: "FiBriefcase",
    fee: 200.0,
    requirements: [
      "DTI Certificate (for business name)",
      "Lease contract or proof of property ownership",
      "Valid ID of business owner",
      "Cedula",
      "Sketch or map of business location",
      "Accomplished form",
      "Fee payment",
    ],
    requiredFields: [
      "business_name",
      "business_address",
      "business_type",
      "business_area_sqm",
      "business_owner_type",
      "dti_registration_number",
      "lease_contract_provided",
    ],
    purpose_options: [
      "New business registration",
      "Business renewal",
      "Mayor's Permit requirement",
      "BIR registration requirement",
      "Other (Please specify)",
    ],
  },
};

class DocumentService {
  // Get authentication token from local storage
  private getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  // Get all document requests for the current user
  async getUserDocumentRequests(): Promise<DocumentRequest[]> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/document_requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = "Failed to fetch document requests";

        // Try to parse error response if possible
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          errorMessage = `Server error (${response.status}): ${
            response.statusText || "Unknown error"
          }`;
        }

        // Show a more specific error for common HTTP status codes
        if (response.status === 500) {
          errorMessage =
            "The server encountered an internal error. Please try again later or contact support if the problem persists.";
        } else if (response.status === 401) {
          errorMessage = "Your session has expired. Please log in again.";
          // Optionally redirect to login page or refresh token here
        } else if (response.status === 403) {
          errorMessage = "You don't have permission to access this resource.";
        }

        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("API Error:", error);

      // Provide a more user-friendly error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to connect to the server. Please check your internet connection and try again.";

      showErrorToast(errorMessage);

      // Return an empty array instead of throwing, to allow the UI to handle gracefully
      return [];
    }
  }

  // Get all document requests (admin/official only)
  async getAllDocumentRequests(
    status?: string,
    documentType?: string
  ): Promise<DocumentRequest[]> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      let url = `${API_URL}/document_requests/all`;
      const params = new URLSearchParams();

      if (status) {
        params.append("status", status);
      }

      if (documentType) {
        params.append("document_type", documentType);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to fetch document requests";
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

  // Get a single document request by ID
  async getDocumentRequest(id: number): Promise<DocumentRequest> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/document_requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to fetch document request";
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

  // Create a new document request
  async createDocumentRequest(
    data: DocumentCreateData
  ): Promise<DocumentRequest> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/document_requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ document_request: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to create document request";
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

  // Update a document request status (admin/official only)
  async updateDocumentRequestStatus(
    id: number,
    status: string,
    remarks?: string
  ): Promise<DocumentRequest> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(
        `${API_URL}/document_requests/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, remarks }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to update document request status";
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

  // Update document request details (only for pending status)
  async updateDocumentRequest(
    id: number,
    data: Partial<DocumentCreateData>
  ): Promise<DocumentRequest> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/document_requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ document_request: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to update document request";
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

  // Delete a document request (only for pending status)
  async deleteDocumentRequest(id: number): Promise<void> {
    const token = this.getToken();

    if (!token) {
      showErrorToast("No authentication token found");
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_URL}/document_requests/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed to delete document request";
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

  // Get document type information
  getDocumentTypeInfo(type: DocumentType): DocumentTypeInfo {
    return DOCUMENT_TYPES[type];
  }

  // Get all document types
  getAllDocumentTypes(): DocumentTypeInfo[] {
    return Object.values(DOCUMENT_TYPES);
  }
}

export default new DocumentService();
