import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type {
  Company,
  CompanyDashboardStats,
  CompanyListFilters,
  RequestCreateCompany,
  UpdateCompanyPayload,
} from "@/types/company";

export const fetchCompanies = async (params: CompanyListFilters = {}) => {
  return axiosClient.get("/companies", {
    params,
  }) as Promise<BackendResponse<Pagination<Company>>>;
};

export const fetchCompanyDashboardStats = async () => {
  return axiosClient.get("/companies/dashboard-stats") as Promise<
    BackendResponse<CompanyDashboardStats>
  >;
};

export const fetchCompanyById = async (id: number) => {
  return axiosClient.get(`/companies/${id}`) as Promise<
    BackendResponse<Company>
  >;
};

export const createCompany = async (companyData: RequestCreateCompany) => {
  return axiosClient.post("/companies", companyData) as Promise<
    BackendResponse<Company>
  >;
};

export const updateCompany = async ({ id, data }: UpdateCompanyPayload) => {
  return axiosClient.put(`/companies/${id}`, data) as Promise<
    BackendResponse<Company>
  >;
};

export const deleteCompany = async (id: number) => {
  return axiosClient.delete(`/companies/${id}`) as Promise<
    BackendResponse<void>
  >;
};
