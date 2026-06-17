import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchIndustries,
  fetchIndustryById,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} from "./industry.api";
import { industryKeys } from "./industry.keys";
import type { IndustryListFilters, UpdateIndustryRequest } from "@/types/industry";

export const useGetIndustries = (filters: IndustryListFilters = {}) => {
  const normalizedFilters: Required<
    Pick<IndustryListFilters, "page" | "size">
  > &
    IndustryListFilters = {
    page: filters.page ?? 1,
    size: filters.size ?? 10,
    ...filters,
  };

  return useQuery({
    queryKey: industryKeys.list(normalizedFilters),
    queryFn: () => fetchIndustries(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetIndustryById = (id: number) => {
  return useQuery({
    queryKey: industryKeys.detail(id),
    queryFn: () => fetchIndustryById(id),
    enabled: !!id,
  });
};

export const useCreateIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIndustry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.lists() });
    },
  });
};

export const useUpdateIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateIndustryRequest }) =>
      updateIndustry(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: industryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: industryKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIndustry,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: industryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: industryKeys.detail(id) });
    },
  });
};
