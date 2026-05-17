export interface Job {
  id: number;
  name: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  quantity: number;
  levels: string[];
  description: string;
  active: boolean;
  company: { id: number; name: string; logo: string };
  specialization: { id: number; name: string };
  skills: string[];
  startDate: string;
  endDate: string;
  requirements?: string[];
  benefits?: string[];
  workingHours?: string;
  skillIds?: number[];
  isSaved: boolean;
  isApplied: boolean;
}

export interface JobListFilters {
  page?: number;
  size?: number;
  location?: string;
  levels?: string[];
  specialization?: number;
  company?: string;
  minSalary?: number;
  maxSalary?: number;
  name?: string;
  keyword?: string;
  skill?: string;
  active?: boolean;
}

export interface JobUpdatePayload {
  name?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  quantity?: number;
  description?: string;
  requirements?: string[];
  levels?: string[];
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  benefits?: string[];
  workingHours?: string;
  companyId?: number;
  specializationId?: number;
  skillIds?: number[];
}
