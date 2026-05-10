import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSkills,
  fetchSkillById,
  createSkill,
  deleteSkill,
} from "./skill.api";
import { skillKeys } from "./skill.keys";
import type { SkillListFilters } from "@/types/skill";

export const useGetSkills = (filters: SkillListFilters = {}) => {
  const normalizedFilters: Required<Pick<SkillListFilters, "page" | "size">> &
    SkillListFilters = {
    page: filters.page ?? 1,
    size: filters.size ?? 10,
    ...filters,
    name: filters.name?.trim() || undefined,
  };

  return useQuery({
    queryKey: skillKeys.list(normalizedFilters),
    queryFn: () => fetchSkills(normalizedFilters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSkillById = (id: number) => {
  return useQuery({
    queryKey: skillKeys.detail(id),
    queryFn: () => fetchSkillById(id),
    enabled: !!id,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.lists() });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: skillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: skillKeys.detail(id) });
    },
  });
};
