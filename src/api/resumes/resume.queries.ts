import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createResume,
  deleteResume,
  fetchMyResumes,
  fetchResumeById,
  fetchResumes,
  updateResume,
  setDefaultResume,
} from "./resume.api";
import { resumeKeys } from "./resume.keys";
import type { ResumeListFilters } from "@/types/resume";

export const useGetResumes = (filters: ResumeListFilters = {}) => {
  const normalizedFilters: Required<Pick<ResumeListFilters, "page" | "size">> &
    ResumeListFilters = {
    page: filters.page ?? 1,
    size: filters.size ?? 10,
    ...filters,
  };

  return useQuery({
    queryKey: resumeKeys.list(normalizedFilters),
    queryFn: () => fetchResumes(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetMyResumes = () => {
  return useQuery({
    queryKey: resumeKeys.mine(),
    queryFn: fetchMyResumes,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetResumeById = (id: number) => {
  return useQuery({
    queryKey: resumeKeys.detail(id),
    queryFn: () => fetchResumeById(id),
    enabled: !!id,
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: resumeKeys.mine() });
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResume,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: resumeKeys.mine() });
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(id) });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: resumeKeys.mine() });
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(id) });
    },
  });
};

export const useSetDefaultResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultResume,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: resumeKeys.mine() });
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(id) });
    },
  });
};
