import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type {
  CreateResumeRequest,
  Resume,
  ResumeListFilters,
  UpdateResumePayload,
} from "@/types/resume";

export const fetchResumes = async (params: ResumeListFilters = {}) => {
  return axiosClient.get("/resumes", {
    params,
  }) as Promise<BackendResponse<Pagination<Resume>>>;
};

export const fetchMyResumes = async () => {
  return axiosClient.get("/my-cvs") as Promise<BackendResponse<Resume[]>>;
};

export const fetchResumeById = async (id: number) => {
  return axiosClient.get(`/resumes/${id}`) as Promise<BackendResponse<Resume>>;
};

export const createResume = async (resumeData: CreateResumeRequest) => {
  return axiosClient.post("/resumes", resumeData) as Promise<
    BackendResponse<Resume>
  >;
};

export const updateResume = async ({ id, data }: UpdateResumePayload) => {
  return axiosClient.put(`/resumes/${id}`, data) as Promise<
    BackendResponse<Resume>
  >;
};

export const deleteResume = async (id: number) => {
  return axiosClient.delete(`/resumes/${id}`) as Promise<BackendResponse<void>>;
};

export const setDefaultResume = async (id: number) => {
  return axiosClient.put(`/resumes/${id}/default`) as Promise<
    BackendResponse<Resume>
  >;
};
