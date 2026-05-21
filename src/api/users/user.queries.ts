import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignCompanyToCurrentUser,
  changePassword,
  createUser,
  deleteUser,
  fetchAccountInfo,
  fetchHrDashboardStats,
  fetchSavedJobs,
  fetchUserById,
  fetchUsers,
  updateUser,
  updateUserRoles,
  toggleSaveJob,
} from "./user.api";
import { userKeys } from "./user.keys";
import { jobKeys } from "@/api/jobs/job.keys";
import type { SavedJobsFilters, UserListFilters } from "@/types/user";

export const useGetUsers = (filters: UserListFilters = {}) => {
  const normalizedFilters: Required<Pick<UserListFilters, "page" | "size">> &
    UserListFilters = {
    ...filters,
    name: filters.name?.trim() || undefined,
    email: filters.email?.trim() || undefined,
    page: filters.page ?? 1,
    size: filters.size ?? 10,
  };

  return useQuery({
    queryKey: userKeys.list(normalizedFilters),
    queryFn: () => fetchUsers(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
};

export const useGetAccountInfo = () => {
  return useQuery({
    queryKey: userKeys.account(),
    queryFn: fetchAccountInfo,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetHrDashboardStats = () => {
  return useQuery({
    queryKey: userKeys.hrDashboardStats(),
    queryFn: fetchHrDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSavedJobs = (filters: SavedJobsFilters = {}) => {
  const normalizedFilters: Required<Pick<SavedJobsFilters, "page" | "size">> =
    {
      page: filters.page ?? 1,
      size: filters.size ?? 10,
    };

  return useQuery({
    queryKey: userKeys.savedJobs(normalizedFilters),
    queryFn: () => fetchSavedJobs(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.account() });
    },
  });
};

export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRoles,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

export const useToggleSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleSaveJob,
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useAssignCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignCompanyToCurrentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
