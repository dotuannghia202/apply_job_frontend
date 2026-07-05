import { toUtcMidnightIso } from "@/helper";
import type { Job, JobListFilters, JobUpdatePayload } from "@/types/job";

export const LEVEL_OPTIONS = [
  "INTERN",
  "JUNIOR",
  "MIDDLE",
  "SENIOR",
  "LEAD",
  "MANAGER",
];

export const DEFAULT_PAGE_SIZE = 6;

export const fieldClass =
  "h-10 rounded-md border-slate-200 bg-white text-sm text-slate-800 shadow-none focus-visible:ring-primary focus-visible:border-primary";

export type EmployerJobFilters = {
  name: string;
  keyword: string;
  location: string;
  levels: string[];
  specialization: string;
  specializationName: string;
  minSalary: string;
  maxSalary: string;
  skill: string;
  active: string;
};

export type SelectedSkill = {
  id: number;
  name: string;
};

export type UpdateJobFormState = {
  name: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  quantity: string;
  description: string;
  requirements: string[];
  levels: string[];
  startDate: string;
  endDate: string;
  benefits: string[];
  workingHours: string;
  specializationId: string;
  selectedSkills: SelectedSkill[];
};

export const createInitialFilters = (): EmployerJobFilters => ({
  name: "",
  keyword: "",
  location: "",
  levels: [],
  specialization: "",
  specializationName: "",
  minSalary: "",
  maxSalary: "",
  skill: "",
  active: "all",
});

export const parseOptionalNumber = (value: string) => {
  if (!value.trim()) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const toDateInputValue = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
};

export const formatDateLabel = (
  value: string | null | undefined,
  locale: string,
  fallback: string,
) => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat(locale).format(date);
};

export const getJobSkillNames = (job: Job) => job.skills ?? [];

export const mapJobToUpdateForm = (
  job: Job,
  formatSkillFallback: (id: number) => string = (id) => `Skill #${id}`,
): UpdateJobFormState => {
  const skillNames = getJobSkillNames(job);
  const selectedSkills =
    job.skillIds?.map((id, index) => ({
      id,
      name: skillNames[index] ?? formatSkillFallback(id),
    })) ?? [];

  return {
    name: job.name ?? "",
    location: job.location ?? "",
    minSalary: job.minSalary?.toString() ?? "",
    maxSalary: job.maxSalary?.toString() ?? "",
    quantity: job.quantity?.toString() ?? "",
    description: job.description ?? "",
    requirements: job.requirements ?? [],
    levels: job.levels ?? [],
    startDate: toDateInputValue(job.startDate),
    endDate: toDateInputValue(job.endDate),
    benefits: job.benefits ?? [],
    workingHours: job.workingHours ?? "",
    specializationId: job.specialization?.id?.toString() ?? "",
    selectedSkills,
  };
};

export function toQueryFilters(
  filters: EmployerJobFilters,
  page: number,
  size: number,
): JobListFilters {
  let active: boolean | undefined = undefined;
  if (filters.active === "active") active = true;
  else if (filters.active === "inactive") active = false;

  return {
    page,
    size,
    location: filters.location,
    levels: filters.levels,
    specialization: parseOptionalNumber(filters.specialization),
    minSalary: parseOptionalNumber(filters.minSalary),
    maxSalary: parseOptionalNumber(filters.maxSalary),
    name: filters.name,
    keyword: filters.keyword,
    skill: filters.skill,
    active,
  };
}

export function getUpdatePayload(form: UpdateJobFormState): JobUpdatePayload {
  return {
    name: form.name.trim() || undefined,
    location: form.location.trim() || undefined,
    minSalary: parseOptionalNumber(form.minSalary),
    maxSalary: parseOptionalNumber(form.maxSalary),
    quantity: parseOptionalNumber(form.quantity),
    description: form.description.trim() || undefined,
    requirements: form.requirements.map((item) => item.trim()).filter(Boolean),
    levels: form.levels,
    startDate: form.startDate ? toUtcMidnightIso(form.startDate) : undefined,
    endDate: form.endDate ? toUtcMidnightIso(form.endDate) : undefined,
    benefits: form.benefits.map((item) => item.trim()).filter(Boolean),
    workingHours: form.workingHours.trim() || undefined,
    specializationId: parseOptionalNumber(form.specializationId),
    skillIds: form.selectedSkills.length
      ? form.selectedSkills.map((skill) => skill.id)
      : undefined,
  };
}
