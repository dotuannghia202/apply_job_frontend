export interface Job {
  id: number;
  name: string;
  location: string;
  salary: number;
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
}

export interface JobListFilters {
  location?: string;
  page?: number;
  size?: number;
  levels?: string[];
  specialization?: number;
  maxSalary?: number;
  skill?: string;
  keyword?: string;
}
