import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompany,
  fetchCompanyDashboardStats,
  fetchCompanies,
  fetchCompanyById,
  fetchMyCompany,
  updateCompany,
} from "./company.api";
import { companyKeys } from "./company.keys";
import type { CompanyListFilters } from "@/types/company";

export const useGetCompanies = (filters: CompanyListFilters = {}) => {
  const normalizedFilters: Required<Pick<CompanyListFilters, "page" | "size">> &
    CompanyListFilters = {
    ...filters,
    name: filters.name?.trim() || undefined,
    page: filters.page ?? 1,
    size: filters.size ?? 10,
  };

  return useQuery({
    queryKey: companyKeys.list(normalizedFilters),
    queryFn: () => fetchCompanies(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCompanyDashboardStats = () => {
  return useQuery({
    queryKey: companyKeys.stats(),
    queryFn: fetchCompanyDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCompanyById = (id: number) => {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => fetchCompanyById(id),
    enabled: !!id,
  });
};

export const useGetMyCompany = (enabled = true) => {
  return useQuery({
    queryKey: companyKeys.myCompany(),
    queryFn: fetchMyCompany,
    enabled,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompany,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(id) });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(id) });
    },
  });
};
