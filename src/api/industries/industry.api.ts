import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type {
  CreateIndustryRequest,
  Industry,
  IndustryListFilters,
  UpdateIndustryRequest,
} from "@/types/industry";

export const fetchIndustries = async (params: IndustryListFilters = {}) => {
  return axiosClient.get("/industries", {
    params,
  }) as Promise<BackendResponse<Pagination<Industry>>>;
};

export const fetchIndustryById = async (id: string) => {
  return axiosClient.get(`/industries/${id}`) as Promise<
    BackendResponse<Industry>
  >;
};

export const createIndustry = async (industryData: CreateIndustryRequest) => {
  return axiosClient.post("/industries", industryData) as Promise<
    BackendResponse<Industry>
  >;
};

export const updateIndustry = async (
  id: string,
  data: UpdateIndustryRequest,
) => {
  return axiosClient.put(`/industries/${id}`, data) as Promise<
    BackendResponse<Industry>
  >;
};

export const deleteIndustry = async (id: string) => {
  return axiosClient.delete(`/industries/${id}`) as Promise<
    BackendResponse<void>
  >;
};
