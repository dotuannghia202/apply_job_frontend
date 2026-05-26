import type { RoleName } from "./auth";
import type { QueryParams } from "./common";

export type UserGender = "FEMALE" | "MALE" | "OTHER";

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  age?: number;
  gender?: UserGender | null;
  address?: string | null;
  isActive?: boolean;
  company?: {
    id: number;
    name: string;
  } | null;
  roles?: Array<RoleName>;
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
  companyId?: number | null;
  roleName?: RoleName;
}

export interface UpdateUserRequest {
  name: string;
  avatarUrl?: string | null;
  age?: number;
  gender?: UserGender | null;
  address?: string | null;
  isActive?: boolean | null;
  companyId?: number | null;
  roles: Array<RoleName>;
}

export interface UpdateUserRolesRequest {
  roles: Array<RoleName>;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

export interface UpdateUserPayload {
  id: number;
  data: UpdateUserRequest;
}

export interface UpdateUserRolesPayload {
  id: number;
  data: UpdateUserRolesRequest;
}

export interface UpdateUserStatusPayload {
  id: number;
  data: UpdateUserStatusRequest;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
