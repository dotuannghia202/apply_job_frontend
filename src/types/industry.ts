export interface Industry {
  id: number;
  name: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface Specialization {
  id: number;
  name: string;
  industry?: Industry;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface CreateIndustryRequest {
  name: string;
}

export interface CreateSpecializationRequest {
  name: string;
  industryId: number;
}

export interface IndustryListFilters {
  page?: number;
  pageSize?: number;
  name?: string;
}

export interface SpecializationListFilters {
  page?: number;
  pageSize?: number;
  name?: string;
  industryId?: number;
}
