import type { QueryParams } from "./common";

export interface ResumeCandidate {
  id: string | number;
  name: string;
  email: string;
}

export interface ResumeSpecialization {
  id: string | number;
  name: string;
}

export interface Resume {
  id: string | number;
  fileName: string;
  fileUrl: string;
  active: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string | null;
  skills: string[];
  candidate: ResumeCandidate;
  specialization: ResumeSpecialization | null;
}

export interface ResumeListFilters extends Pick<QueryParams, "page" | "size"> {
  filter?: string;
}

export interface CreateResumeRequest {
  fileName: string;
  fileUrl: string;
  active?: boolean;
  skillIds?: (number | string)[];
  specializationId?: string | number;
}

export interface UpdateResumeRequest {
  fileName?: string;
  fileUrl?: string;
  active?: boolean;
  skillIds?: (number | string)[];
  specializationId?: string | number;
}

export interface UpdateResumePayload {
  id: string | number;
  data: UpdateResumeRequest;
}
