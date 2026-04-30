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
}

export interface JobListFilters {
  location?: string;
  page?: number;
  pageSize?: number;
  levels?: string[];
  specialization?: number;
  name?: string;
  skill?: string;
}
