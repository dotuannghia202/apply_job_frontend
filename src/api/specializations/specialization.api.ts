import type {
  BackendResponse,
  Pagination,
  ResObjectCommon,
} from "@/types/common";
import axiosClient from "../axiosClient";
import type {
  CreateSpecializationRequest,
  Specialization,
  SpecializationListFilters,
} from "@/types/industry";

export const fetchSpecializations = async (
  params: SpecializationListFilters = {},
) => {
  return axiosClient.get("/specializations", {
    params,
  }) as Promise<BackendResponse<Pagination<Specialization>>>;
};

export const fetchSpecializationById = async (id: number) => {
  return axiosClient.get(`/specializations/${id}`) as Promise<
    BackendResponse<Specialization>
  >;
};

export const createSpecialization = async (
  specializationData: CreateSpecializationRequest,
) => {
  return axiosClient.post("/specializations", specializationData) as Promise<
    BackendResponse<Specialization>
  >;
};

export const deleteSpecialization = async (id: number) => {
  return axiosClient.delete(`/specializations/${id}`) as Promise<
    BackendResponse<void>
  >;
};

export const fetchSpecializationsByIndustryId = async (industryId: number) => {
  return axiosClient.get(
    `/specializations/by-industry/${industryId}`,
  ) as Promise<BackendResponse<ResObjectCommon[]>>;
};
