import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type {
  CreateIndustryRequest,
  Industry,
  IndustryListFilters,
} from "@/types/industry";

export const fetchIndustries = async (params: IndustryListFilters = {}) => {
  return axiosClient.get("/industries", {
    params,
  }) as Promise<BackendResponse<Pagination<Industry>>>;
};

export const fetchIndustryById = async (id: number) => {
  return axiosClient.get(`/industries/${id}`) as Promise<
    BackendResponse<Industry>
  >;
};

export const createIndustry = async (industryData: CreateIndustryRequest) => {
  return axiosClient.post("/industries", industryData) as Promise<
    BackendResponse<Industry>
  >;
};

export const deleteIndustry = async (id: number) => {
  return axiosClient.delete(`/industries/${id}`) as Promise<
    BackendResponse<void>
  >;
};
