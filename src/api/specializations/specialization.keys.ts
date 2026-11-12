import type { SpecializationListFilters } from "@/types/industry";

export const specializationKeys = {
  all: ["specializations"] as const,
  lists: () => [...specializationKeys.all, "list"] as const,
  list: (filters: SpecializationListFilters) =>
    [...specializationKeys.lists(), filters] as const,
  byIndustry: (industryId: string) =>
    [...specializationKeys.all, "by-industry", industryId] as const,
  details: () => [...specializationKeys.all, "detail"] as const,
  detail: (id: string) => [...specializationKeys.details(), id] as const,
};
