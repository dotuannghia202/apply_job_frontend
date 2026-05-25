export interface AdminIndustryStat {
  industryName: string;
  jobCount: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  totalCompanies: number;
  totalActiveJobs: number;
  totalApplications: number;
  industryStats: AdminIndustryStat[];
}
