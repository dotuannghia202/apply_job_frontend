export interface Job {
  id: string | number;
  name: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  quantity: number;
  levels: string[];
  description: string;
  active: boolean;
  company: { id: string | number; name: string; logo: string };
  specialization: { id: string | number; name: string };
  skills: string[];
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
  requirements?: string[];
  benefits?: string[];
  workingHours?: string;
  skillIds?: (string | number)[];
  applicantCount?: number;
  isSaved: boolean;
  isApplied: boolean;
}

export interface JobListFilters {
  page?: number;
  size?: number;
  location?: string;
  levels?: string[];
  specialization?: string | number;
  companyName?: string;
  minSalary?: number;
  maxSalary?: number;
  name?: string;
  keyword?: string;
  skill?: string;
  active?: boolean;
  sort?: string;
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
  companyId?: string | number;
  specializationId?: string | number;
  skillIds?: (string | number)[];
}
