import type { ResumeListFilters } from "@/types/resume";

export const resumeKeys = {
  all: ["resumes"] as const,
  lists: () => [...resumeKeys.all, "list"] as const,
  list: (filters: ResumeListFilters) =>
    [...resumeKeys.lists(), filters] as const,
  mine: () => [...resumeKeys.all, "mine"] as const,
  details: () => [...resumeKeys.all, "detail"] as const,
  detail: (id: number) => [...resumeKeys.details(), id] as const,
};
