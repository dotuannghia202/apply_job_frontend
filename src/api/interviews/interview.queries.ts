import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchInterviewSessionById,
  fetchInterviewSessionByApplication,
  startInterviewSession,
  submitInterviewSession,
} from "./interview.api";

export const interviewKeys = {
  all: ["interviews"] as const,
  detail: (id: number) => [...interviewKeys.all, "detail", id] as const,
  byApp: (appId: number) => [...interviewKeys.all, "application", appId] as const,
};

export const useGetInterviewSession = (sessionId: number) => {
  return useQuery({
    queryKey: interviewKeys.detail(sessionId),
    queryFn: () => fetchInterviewSessionById(sessionId),
    enabled: Number.isFinite(sessionId) && sessionId > 0,
    staleTime: 30 * 1000,
  });
};

export const useGetInterviewSessionByApplication = (applicationId: number) => {
  return useQuery({
    queryKey: interviewKeys.byApp(applicationId),
    queryFn: () => fetchInterviewSessionByApplication(applicationId),
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    staleTime: 30 * 1000,
  });
};

export const useStartInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => startInterviewSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.detail(sessionId) });
    },
  });
};

export const useSubmitInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      formData,
    }: {
      sessionId: number;
      formData: FormData;
    }) => submitInterviewSession(sessionId, formData),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.detail(sessionId) });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
