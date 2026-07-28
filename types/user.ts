export type UserRole = "malik" | "muteahhit" | "admin";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type ContractorStatus = "pending" | "approved" | "rejected";

export type ContractorProfile = {
  user_id: string;
  company_name: string;
  tax_number: string | null;
  city: string;
  about: string | null;
  verification_status: ContractorStatus;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContractorDocument = {
  id: string;
  user_id: string;
  doc_type: string;
  file_path: string;
  file_name: string;
  created_at: string;
};
