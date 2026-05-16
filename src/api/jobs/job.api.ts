import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type { Job, JobListFilters } from "@/types/job";

const serializeJobParams = (params: JobListFilters) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          searchParams.append(key, String(item));
        }
      });
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

export const fetchJobs = async (params: JobListFilters = {}) => {
  return axiosClient.get("/jobs", {
    params,
    paramsSerializer: {
      serialize: serializeJobParams,
    },
  }) as Promise<BackendResponse<Pagination<Job>>>;
};

export const fetchJobById = async (id: number) => {
  return axiosClient.get(`/jobs/${id}`) as Promise<BackendResponse<Job>>;
};

export const createJob = async (jobData: any) => {
  return axiosClient.post("/jobs", jobData) as Promise<BackendResponse<Job>>;
};

export const deleteJob = async (id: number) => {
  return axiosClient.delete(`/jobs/${id}`) as Promise<BackendResponse<void>>;
};
