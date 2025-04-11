import { User } from "../context/AuthContext";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ResidentialAddress {
  id?: number;
  house_number: string;
  street_name: string;
  purok: string;
  barangay: string;
  city: string;
  province: string;
}
