import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createApplication,
  fetchApplicationById,
  fetchApplications,
  updateApplicationByCandidate,
  updateApplicationStatus,
} from "./application.api";
import { applicationKeys } from "./application.keys";
import type { ApplicationListFilters } from "@/types/application";

export const useGetApplications = (filters: ApplicationListFilters = {}) => {
  const normalizedFilters: Required<
    Pick<ApplicationListFilters, "page" | "size">
  > &
    ApplicationListFilters = {
    page: filters.page ?? 1,
    size: filters.size ?? 10,
    ...filters,
  };

  return useQuery({
    queryKey: applicationKeys.list(normalizedFilters),
    queryFn: () => fetchApplications(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetApplicationById = (id: number) => {
  return useQuery({
    queryKey: applicationKeys.detail(id),
    queryFn: () => fetchApplicationById(id),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
    },
  });
};

export const useUpdateApplicationByCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationByCandidate,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationKeys.detail(id) });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationKeys.detail(id) });
    },
  });
};
