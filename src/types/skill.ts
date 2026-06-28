export interface Skill {
  id: number;
  name: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface CreateSkillRequest {
  name: string;
}

export interface UpdateSkillRequest {
  name: string;
}

export interface SkillListFilters {
  page?: number;
  size?: number;
  name?: string;
}
