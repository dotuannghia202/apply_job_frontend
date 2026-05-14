import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type {
  CreateUserRequest,
  UpdateUserPayload,
  UpdateUserRolesPayload,
  User,
  UserListFilters,
} from "@/types/user";

export const fetchUsers = async (params: UserListFilters = {}) => {
  return axiosClient.get("/users", {
    params,
  }) as Promise<BackendResponse<Pagination<User>>>;
};

export const fetchUserById = async (id: number) => {
  return axiosClient.get(`/users/${id}`) as Promise<BackendResponse<User>>;
};

export const fetchAccountInfo = async () => {
  return axiosClient.get("/auth/account") as Promise<
    BackendResponse<User | { user: User }>
  >;
};

export const createUser = async (userData: CreateUserRequest) => {
  return axiosClient.post("/users", userData) as Promise<BackendResponse<User>>;
};

export const updateUser = async ({ id, data }: UpdateUserPayload) => {
  return axiosClient.put(`/users/${id}`, data) as Promise<
    BackendResponse<User>
  >;
};

export const updateUserRoles = async ({ id, data }: UpdateUserRolesPayload) => {
  return axiosClient.put(`/users/${id}/roles`, data) as Promise<
    BackendResponse<User>
  >;
};

export const assignCompanyToCurrentUser = async (companyId: number) => {
  return axiosClient.put("/assign-company", companyId) as Promise<
    BackendResponse<void>
  >;
};

export const deleteUser = async (id: number) => {
  return axiosClient.delete(`/users/${id}`) as Promise<BackendResponse<void>>;
};

export const toggleSaveJob = async (jobId: number) => {
  return axiosClient.post(`/users/save-job/${jobId}`) as Promise<
    BackendResponse<boolean>
  >;
};
