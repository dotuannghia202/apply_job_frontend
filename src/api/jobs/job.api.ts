import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type { Job, JobListFilters, JobUpdatePayload } from "@/types/job";

export type GenerateJdAiPayload = {
  title: string;
  skills: string;
  levels: string;
};

export type GenerateJdAiResult = {
  description: string;
  requirements: string[];
  benefits: string[];
};

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

export const fetchHrJobs = async (params: JobListFilters = {}) => {
  return axiosClient.get("/jobs/hr", {
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

export const updateJob = async ({
  id,
  data,
}: {
  id: number;
  data: JobUpdatePayload;
}) => {
  return axiosClient.put(`/jobs/${id}`, data) as Promise<BackendResponse<Job>>;
};

export const deleteJob = async (id: number) => {
  return axiosClient.delete(`/jobs/${id}`) as Promise<BackendResponse<void>>;
};

export const generateJdAi = async (payload: GenerateJdAiPayload) => {
  return axiosClient.post("/jobs/generate-jd", payload) as Promise<
    BackendResponse<GenerateJdAiResult>
  >;
};
