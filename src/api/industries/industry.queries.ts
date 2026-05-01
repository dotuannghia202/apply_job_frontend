import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchIndustries,
  fetchIndustryById,
  createIndustry,
  deleteIndustry,
} from "./industry.api";
import { industryKeys } from "./industry.keys";
import type { IndustryListFilters } from "@/types/industry";

export const useGetIndustries = (filters: IndustryListFilters = {}) => {
  const normalizedFilters: Required<
    Pick<IndustryListFilters, "page" | "pageSize">
  > &
    IndustryListFilters = {
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 10,
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
