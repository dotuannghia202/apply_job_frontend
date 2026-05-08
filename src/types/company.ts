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
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
}

export interface CompanyListFilters {
  page?: number;
  size?: number;
  name?: string;
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
