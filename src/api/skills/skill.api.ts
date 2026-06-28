import type { BackendResponse, Pagination } from "@/types/common";
import axiosClient from "../axiosClient";
import type {
  CreateSkillRequest,
  Skill,
  SkillListFilters,
  UpdateSkillRequest,
} from "@/types/skill";

export const fetchSkills = async (params: SkillListFilters = {}) => {
  return axiosClient.get("/skills", {
    params,
  }) as Promise<BackendResponse<Pagination<Skill>>>;
};

export const fetchSkillById = async (id: number) => {
  return axiosClient.get(`/skills/${id}`) as Promise<BackendResponse<Skill>>;
};

export const createSkill = async (skillData: CreateSkillRequest) => {
  return axiosClient.post("/skills", skillData) as Promise<
    BackendResponse<Skill>
  >;
};

export const updateSkill = async (
  id: number,
  data: UpdateSkillRequest,
) => {
  return axiosClient.put(`/skills/${id}`, data) as Promise<
    BackendResponse<Skill>
  >;
};

export const deleteSkill = async (id: number) => {
  return axiosClient.delete(`/skills/${id}`) as Promise<BackendResponse<void>>;
};
