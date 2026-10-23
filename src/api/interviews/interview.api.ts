import axiosClient from "../axiosClient";
import type { BackendResponse } from "@/types/common";
import type { ResInterviewSessionDTO } from "@/types/interview";

export const fetchInterviewSessionById = async (sessionId: number) => {
  return axiosClient.get(`/interviews/${sessionId}`) as Promise<
    BackendResponse<ResInterviewSessionDTO>
  >;
};

export const fetchInterviewSessionByApplication = async (applicationId: number) => {
  return axiosClient.get(`/interviews/by-application/${applicationId}`) as Promise<
    BackendResponse<ResInterviewSessionDTO>
  >;
};

export const startInterviewSession = async (sessionId: number) => {
  return axiosClient.post(`/interviews/${sessionId}/start`) as Promise<
    BackendResponse<void>
  >;
};

export const submitInterviewSession = async (
  sessionId: number,
  formData: FormData,
) => {
  return axiosClient.post(`/interviews/${sessionId}/submit`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }) as Promise<BackendResponse<void>>;
};
