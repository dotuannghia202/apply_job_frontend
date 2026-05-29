export interface RequestCreateCompany {
  name: string;
  description: string;
  address: string;
  logo: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;
  address: string;
  logo: string;
  status?: CompanyStatus;
  employerName?: string;
  employerEmail?: string;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
}

export type CompanyStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface CompanyListFilters {
  page?: number;
  size?: number;
  name?: string;
  status?: CompanyStatus;
  startDate?: string;
  endDate?: string;
}

export interface CompanyDashboardStats {
  totalCompanies: number;
  pendingApproval: number;
  approved: number;
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string;
  address?: string;
  logo?: string;
}

export interface UpdateCompanyPayload {
  id: number;
  data: UpdateCompanyRequest;
}

export interface ApproveCompanyPayload {
  id: number;
  isApproved: boolean;
}

export interface ToggleSuspendCompanyPayload {
  id: number;
  isSuspended: boolean;
}
