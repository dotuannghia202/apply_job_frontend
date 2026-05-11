export type SavedJob = {
  id: string;
  company: string;
  title: string;
  salary: string;
  location: string;
  daysLeft?: number;
  isClosed?: boolean;
  logoUrl?: string;
  logoAlt?: string;
  logoFallback?: "building" | "creative";
};
