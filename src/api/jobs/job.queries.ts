import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createJob,
  deleteJob,
  fetchHrJobs,
  fetchJobById,
  fetchJobs,
  generateJdAi,
  updateJob,
} from "./job.api";
import { jobKeys } from "./job.keys";
import type { JobListFilters } from "@/types/job";

const normalizeJobFilters = (filters: JobListFilters = {}) => {
  const cleanText = (value?: string) => value?.trim() || undefined;
  const cleanNumber = (value?: number) =>
    typeof value === "number" && Number.isFinite(value) ? value : undefined;
  const cleanLevels = filters.levels
    ?.map((level) => level.trim())
    .filter(Boolean);

  return {
    page: filters.page ?? 1,
    size: filters.size ?? 10,
    location: cleanText(filters.location),
    levels: cleanLevels?.length ? cleanLevels : undefined,
    specialization: cleanNumber(filters.specialization),
    company: cleanText(filters.company),
    minSalary: cleanNumber(filters.minSalary),
    maxSalary: cleanNumber(filters.maxSalary),
    name: cleanText(filters.name),
    keyword: cleanText(filters.keyword),
    skill: cleanText(filters.skill),
    active: typeof filters.active === "boolean" ? filters.active : true,
    sort: cleanText(filters.sort),
  } satisfies Required<Pick<JobListFilters, "page" | "size">> & JobListFilters;
};

export const useGetJobs = (filters: JobListFilters = {}) => {
  const normalizedFilters = normalizeJobFilters(filters);

  return useQuery({
    queryKey: jobKeys.list(normalizedFilters),
    queryFn: () => fetchJobs(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetHrJobs = (filters: JobListFilters = {}) => {
  const normalizedFilters = normalizeJobFilters(filters);

  return useQuery({
    queryKey: jobKeys.hrList(normalizedFilters),
    queryFn: () => fetchHrJobs(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetJobById = (id: number) => {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => fetchJobById(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.hrLists() });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.hrLists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.hrLists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
    },
  });
};

export const useGenerateJdAi = () => {
  return useMutation({
    mutationFn: generateJdAi,
  });
};
