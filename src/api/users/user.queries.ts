import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  fetchUserById,
  fetchUsers,
  updateUser,
} from "./user.api";
import { userKeys } from "./user.keys";
import type { UserListFilters } from "@/types/user";

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
