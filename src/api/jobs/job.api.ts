import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type { Job, JobListFilters } from "@/types/job";

export const fetchJobs = async (params: JobListFilters = {}) => {
  return axiosClient.get("/jobs", {
    params,
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
