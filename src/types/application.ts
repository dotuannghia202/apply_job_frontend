import type { QueryParams } from "./common";

export type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED";

export interface ApplicationJobCompany {
  id: number;
  name: string;
  logo?: string | null;
}

export interface ApplicationJob {
  id: number;
  name: string;
  location?: string | null;
  company?: ApplicationJobCompany | null;
}

export interface ApplicationResume {
  id: number;
  fileName?: string | null;
  fileUrl?: string | null;
}

export interface Application {
  id: number;
  status: ApplicationStatus;
  matchScore?: number | null;
  coverLetter?: string | null;
  appliedAt?: string | null;
  job?: ApplicationJob | null;
  resume?: ApplicationResume | null;
}

export interface ApplicationListFilters extends Pick<
  QueryParams,
  "page" | "size"
> {
  status?: ApplicationStatus;
  filter?: string;
}

export interface CreateApplicationRequest {
  jobId: number;
  resumeId: number;
  coverLetter?: string;
}

export interface UpdateApplicationRequest {
  resumeId?: number;
  coverLetter?: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}

export interface UpdateApplicationPayload {
  id: number;
  data: UpdateApplicationRequest;
}

export interface UpdateApplicationStatusPayload {
  id: number;
  data: UpdateApplicationStatusRequest;
}
