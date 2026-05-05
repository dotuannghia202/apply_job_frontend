export interface JobPosted {
  id: number;
  name: string;
  status: "Open" | "Closed";
  applicants: number;
  postedDate: string;
}

export interface Applicant {
  id: number;
  name: string;
  role: string;
  avatarUrl: string;
  matchScore: number;
}

export interface StatCard {
  id: string;
  label: string;
  value: string;
  badge: string;
  icon: string;
  variant: "default" | "secondary" | "ai";
}

export interface Skill {
  id: string;
  label: string;
}

export interface Responsibility {
  id: string;
  icon: string;
  text: string;
}

export interface RequirementItem {
  id: string;
  text: string;
}

export interface BenefitItem {
  id: string;
  icon: string;
  text: string;
}
