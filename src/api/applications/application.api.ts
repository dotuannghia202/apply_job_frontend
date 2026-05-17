import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type {
  Application,
  ApplicationListFilters,
  CreateApplicationRequest,
  UpdateApplicationPayload,
  UpdateApplicationStatusPayload,
} from "@/types/application";

export const fetchApplications = async (
  params: ApplicationListFilters = {},
) => {
  return axiosClient.get("/applications", {
    params,
  }) as Promise<BackendResponse<Pagination<Application>>>;
};

export const fetchHrApplications = async (
  params: ApplicationListFilters = {},
) => {
  return axiosClient.get("/applications/hr", {
    params,
  }) as Promise<BackendResponse<Pagination<Application>>>;
};

export const fetchApplicationById = async (id: number) => {
  return axiosClient.get(`/applications/${id}`) as Promise<
    BackendResponse<Application>
  >;
};

export const createApplication = async (payload: CreateApplicationRequest) => {
  return axiosClient.post("/applications", payload) as Promise<
    BackendResponse<Application>
  >;
};

export const updateApplicationByCandidate = async ({
  id,
  data,
}: UpdateApplicationPayload) => {
  return axiosClient.put(`/applications/${id}`, data) as Promise<
    BackendResponse<Application>
  >;
};

export const updateApplicationStatus = async ({
  id,
  data,
}: UpdateApplicationStatusPayload) => {
  return axiosClient.put(`/applications/${id}/status`, data) as Promise<
    BackendResponse<Application>
  >;
};
