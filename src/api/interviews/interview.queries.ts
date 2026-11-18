import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchInterviewSessionById,
  fetchInterviewSessionByApplication,
  startInterviewSession,
  submitInterviewSession,
  retryEvaluateInterviewSession,
} from "./interview.api";

export const interviewKeys = {
  all: ["interviews"] as const,
  detail: (id: number | string) => [...interviewKeys.all, "detail", id] as const,
  byApp: (appId: number | string) => [...interviewKeys.all, "application", appId] as const,
};

export const useGetInterviewSession = (sessionId?: number | string) => {
  return useQuery({
    queryKey: interviewKeys.detail(sessionId ?? ""),
    queryFn: () => fetchInterviewSessionById(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 30 * 1000,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status === "EVALUATING" ? 4000 : false;
    },
  });
};

export const useGetInterviewSessionByApplication = (applicationId?: number | string) => {
  return useQuery({
    queryKey: interviewKeys.byApp(applicationId ?? ""),
    queryFn: () => fetchInterviewSessionByApplication(applicationId!),
    enabled: Boolean(applicationId),
    staleTime: 30 * 1000,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status === "EVALUATING" ? 4000 : false;
    },
  });
};

export const useStartInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number | string) => startInterviewSession(sessionId),
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
      sessionId: number | string;
      formData: FormData;
    }) => submitInterviewSession(sessionId, formData),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.detail(sessionId) });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useRetryEvaluateInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number | string) => retryEvaluateInterviewSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.detail(sessionId) });
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
