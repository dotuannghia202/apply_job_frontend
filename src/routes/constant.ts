import type { RoleName } from "@/types/auth";

type NavItem = {
  label: string;
  to: string;
  allowedRoles?: RoleName[];
};
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    allowedRoles: ["ADMIN", "EMPLOYER"],
  },
  {
    label: "Candidate Job Search",
    to: "/jobs",
    allowedRoles: ["CANDIDATE"],
  },
  {
    label: "JD Generator",
    to: "/jobs/jd-generator",
    allowedRoles: ["ADMIN", "EMPLOYER"],
  },
  {
    label: "System Analytics",
    to: "/analytics/system",
    allowedRoles: ["ADMIN"],
  },
  {
    label: "Profile",
    to: "/profile",
  },
  {
    label: "Settings",
    to: "/settings",
  },
];
