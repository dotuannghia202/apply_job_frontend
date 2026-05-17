import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createApplication,
  fetchApplicationById,
  fetchApplications,
  fetchHrApplications,
  updateApplicationByCandidate,
  updateApplicationStatus,
} from "./application.api";
import { applicationKeys } from "./application.keys";
import { jobKeys } from "@/api/jobs/job.keys";
import { userKeys } from "@/api/users/user.keys";
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

export const useGetHrApplications = (
  filters: ApplicationListFilters = {},
) => {
  const normalizedFilters: Required<
    Pick<ApplicationListFilters, "page" | "size">
  > &
    ApplicationListFilters = {
    page: filters.page ?? 1,
    size: filters.size ?? 10,
    ...filters,
    filter: filters.filter?.trim() || undefined,
  };

  return useQuery({
    queryKey: applicationKeys.hrList(normalizedFilters),
    queryFn: () => fetchHrApplications(normalizedFilters),
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
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateApplicationByCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationByCandidate,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationKeys.hrLists() });
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
      queryClient.invalidateQueries({ queryKey: applicationKeys.hrLists() });
      queryClient.invalidateQueries({ queryKey: applicationKeys.detail(id) });
    },
  });
};
