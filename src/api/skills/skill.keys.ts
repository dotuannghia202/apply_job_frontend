import type { SkillListFilters } from "@/types/skill";

export const skillKeys = {
  all: ["skills"] as const,
  lists: () => [...skillKeys.all, "list"] as const,
  list: (filters: SkillListFilters) => [...skillKeys.lists(), filters] as const,
  details: () => [...skillKeys.all, "detail"] as const,
  detail: (id: number) => [...skillKeys.details(), id] as const,
};
