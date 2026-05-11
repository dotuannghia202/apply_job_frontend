import type { QueryParams } from "./common";

export interface ResumeCandidate {
  id: number;
  name: string;
  email: string;
}

export interface ResumeSpecialization {
  id: number;
  name: string;
}

export interface Resume {
  id: number;
  fileName: string;
  fileUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string | null;
  skills: string[];
  candidate: ResumeCandidate;
  specialization: ResumeSpecialization;
}

export interface ResumeListFilters extends Pick<QueryParams, "page" | "size"> {
  filter?: string;
}

export interface CreateResumeRequest {
  [key: string]: unknown;
}

export interface UpdateResumeRequest {
  [key: string]: unknown;
}

export interface UpdateResumePayload {
  id: number;
  data: UpdateResumeRequest;
}
