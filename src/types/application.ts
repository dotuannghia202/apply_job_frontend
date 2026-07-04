import type { QueryParams } from "./common";

export type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED";

export interface ApplicationJobInfo {
  id: number;
  name: string;
  companyName?: string | null;
  location?: string | null;
  companyLogo?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
}

export interface ApplicationResumeInfo {
  id: number;
  fileName?: string | null;
  fileUrl?: string | null;
}

export interface ApplicationCandidateInfo {
  id: number;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface Application {
  id: number;
  status: ApplicationStatus;
  matchScore?: number | null;
  coverLetter?: string | null;
  hasCoverLetter?: boolean | null;
  appliedAt?: string | null;
  job?: ApplicationJobInfo | null;
  resume?: ApplicationResumeInfo | null;
  candidate?: ApplicationCandidateInfo | null;
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
