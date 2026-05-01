import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSpecializations,
  fetchSpecializationById,
  fetchSpecializationsByIndustryId,
  createSpecialization,
  deleteSpecialization,
} from "./specialization.api";
import { specializationKeys } from "./specialization.keys";
import type { SpecializationListFilters } from "@/types/industry";

export const useGetSpecializations = (
  filters: SpecializationListFilters = {},
) => {
  const normalizedFilters: Required<
    Pick<SpecializationListFilters, "page" | "pageSize">
  > &
    SpecializationListFilters = {
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 10,
    ...filters,
  };

  return useQuery({
    queryKey: specializationKeys.list(normalizedFilters),
    queryFn: () => fetchSpecializations(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSpecializationById = (id: number) => {
  return useQuery({
    queryKey: specializationKeys.detail(id),
    queryFn: () => fetchSpecializationById(id),
    enabled: !!id,
  });
};

export const useGetSpecializationsByIndustryId = (industryId: number) => {
  return useQuery({
    queryKey: specializationKeys.byIndustry(industryId),
    queryFn: () => fetchSpecializationsByIndustryId(industryId),
    enabled: !!industryId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSpecialization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpecialization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specializationKeys.lists() });
    },
  });
};

export const useDeleteSpecialization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSpecialization,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: specializationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: specializationKeys.detail(id),
      });
    },
  });
};
