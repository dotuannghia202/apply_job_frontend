import type { RoleName } from "./auth";
import type { QueryParams } from "./common";

export type UserGender = "FEMALE" | "MALE" | "OTHER";

export interface User {
  id: number | string;
  email: string;
  name: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  age?: number;
  gender?: UserGender | null;
  address?: string | null;
  isActive?: boolean;
  company?: {
    id: number | string;
    name: string;
    logo?: string | null;
  } | null;
  roles?: Array<RoleName>;
  preferredLanguage?: string | null;
}

export interface UserListFilters extends Pick<QueryParams, "page" | "size"> {
  keyword?: string;
  isActive?: boolean;
  role?: RoleName;
}

export interface SavedJobsFilters extends Pick<QueryParams, "page" | "size"> {}

export interface HrDashboardStats {
  totalActiveJobs: number;
  totalApplicants: number;
  avgAiMatchRate: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: UserGender | null;
  address?: string | null;
  companyId?: number | string | null;
  roleName?: RoleName;
}

export interface UpdateUserRequest {
  name: string;
  preferredLanguage?: string | null;
  avatarUrl?: string | null;
  age?: number;
  gender?: UserGender | null;
  address?: string | null;
  isActive?: boolean | null;
  companyId?: number | string | null;
  roles: Array<RoleName>;
}

export interface UpdateUserRolesRequest {
  roles: Array<RoleName>;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

export interface UpdateUserPayload {
  id: number | string;
  data: UpdateUserRequest;
}

export interface UpdateUserRolesPayload {
  id: number | string;
  data: UpdateUserRolesRequest;
}

export interface UpdateUserStatusPayload {
  id: number | string;
  data: UpdateUserStatusRequest;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
