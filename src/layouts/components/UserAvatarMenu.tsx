import { useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ClipboardList,
  FileText,
  FileUser,
  Heart,
  LogOut,
  PanelTop,
  Send,
  ShieldCheck,
  Sparkles,
  UserCog,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import authApi from "@/api/authApi";
import avatarPlaceholder from "@/assets/images/avatar-placeholder.webp";
import { normalizeRoles } from "@/helper/auth-roles";
import { useAuthStore } from "@/store/auth.store";
import type { RoleName } from "@/types/auth";

type AccountMenuItem = {
  label: string;
  icon: LucideIcon;
  to: string;
};

type AccountMenuSection = {
  title: string;
  icon: LucideIcon;
  items: AccountMenuItem[];
};

const employerModePaths = ["/employer", "/jobs/jd-generator", "/jobs/publish"];
const adminModePaths = ["/admin", "/analytics/system"];

const personalSecuritySection: AccountMenuSection = {
  title: "Personal & Security",
  icon: ShieldCheck,
  items: [
    {
      label: "Profile Settings",
      icon: UserCog,
      to: "/settings#profile",
    },
  ],
};

const menuSectionsByMode: Record<RoleName, AccountMenuSection[]> = {
  CANDIDATE: [
    {
      title: "Job Search Management",
      icon: BriefcaseBusiness,
      items: [
        {
          label: "Saved Jobs",
          icon: Heart,
          to: "/jobs/saved",
        },
        {
          label: "Applied Jobs",
          icon: Send,
          to: "/applications",
        },
        {
          label: "Recommended Jobs",
          icon: Sparkles,
          to: "/jobs",
        },
      ],
    },
    {
      title: "CV Management",
      icon: FileText,
      items: [
        {
          label: "My CV List",
          icon: FileUser,
          to: "/my-cv",
        },
      ],
    },
    personalSecuritySection,
  ],
  EMPLOYER: [
    {
      title: "Recruitment Management",
      icon: BriefcaseBusiness,
      items: [
        {
          label: "Dashboard",
          icon: BarChart3,
          to: "/employer/dashboard",
        },
        {
          label: "Applicants",
          icon: UsersRound,
          to: "/employer/applicants",
        },
      ],
    },
    {
      title: "Job Management",
      icon: ClipboardList,
      items: [
        {
          label: "My Jobs",
          icon: FileText,
          to: "/employer/jobs",
        },
        {
          label: "Post a Job",
          icon: BriefcaseBusiness,
          to: "/jobs/jd-generator",
        },
      ],
    },
    {
      title: "Company",
      icon: Building2,
      items: [
        {
          label: "Company Profile",
          icon: Building2,
          to: "/employer/onboarding/company",
        },
      ],
    },
    personalSecuritySection,
  ],
  ADMIN: [
    {
      title: "System Administration",
      icon: ShieldCheck,
      items: [
        {
          label: "Dashboard",
          icon: BarChart3,
          to: "/admin/dashboard",
        },
        {
          label: "Management User",
          icon: UsersRound,
          to: "/admin/users",
        },
        {
          label: "Company Approval",
          icon: Building2,
          to: "/admin/company-approval",
        },
      ],
    },
    {
      title: "Job Management",
      icon: ClipboardList,
      items: [
        {
          label: "Job Listings",
          icon: FileText,
          to: "/jobs",
        },
        {
          label: "Post a Job",
          icon: BriefcaseBusiness,
          to: "/jobs/jd-generator",
        },
      ],
    },
    personalSecuritySection,
  ],
};

const allMenuSections = [
  ...menuSectionsByMode.CANDIDATE,
  ...menuSectionsByMode.EMPLOYER,
  ...menuSectionsByMode.ADMIN,
];

const defaultOpenSections = allMenuSections.reduce<Record<string, boolean>>(
  (openSections, section) => ({
    ...openSections,
    [section.title]: true,
  }),
  {},
);

function getMenuMode(pathname: string, roles: RoleName[]): RoleName {
  if (
    roles.includes("ADMIN") &&
    adminModePaths.some((path) => pathname.startsWith(path))
  ) {
    return "ADMIN";
  }

  if (
    roles.includes("EMPLOYER") &&
    employerModePaths.some((path) => pathname.startsWith(path))
  ) {
    return "EMPLOYER";
  }

  if (roles.includes("CANDIDATE")) return "CANDIDATE";
  if (roles.includes("EMPLOYER")) return "EMPLOYER";
  if (roles.includes("ADMIN")) return "ADMIN";

  return "CANDIDATE";
}

function AccountDropdownSection({
  isOpen,
  onToggle,
  onItemSelect,
  section,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onItemSelect: (to: string) => void;
  section: AccountMenuSection;
}) {
  const SectionIcon = section.icon;

  return (
    <section>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="group/section flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <div
          className={`flex size-10 shrink-0 items-center justify-center transition-colors group-hover/section:text-primary ${
            isOpen ? "text-primary" : "text-slate-500"
          }`}
        >
          <SectionIcon className="size-6" />
        </div>

        <span
          className={`min-w-0 flex-1 text-[15px] font-semibold transition-colors group-hover/section:text-primary ${
            isOpen ? "text-primary" : "text-slate-800"
          }`}
        >
          {section.title}
        </span>

        <ChevronDown
          className={`size-5 shrink-0 transition-[color,transform] duration-300 group-hover/section:text-primary ${
            isOpen ? "rotate-180 text-primary" : "text-slate-500"
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 pb-3 pl-18 pr-5">
            {section.items.map((item) => {
              const ItemIcon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => onItemSelect(item.to)}
                  className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left text-[15px] font-semibold text-slate-500 transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                >
                  <ItemIcon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const UserAvatarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const avatarUrl = useAuthStore((state) => state.avatarUrl);
  const logout = useAuthStore((state) => state.logout);
  const [openSections, setOpenSections] = useState(defaultOpenSections);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const roles = normalizeRoles(user?.roles ?? []);
  const mode = getMenuMode(location.pathname, roles);
  const accountMenuSections = menuSectionsByMode[mode];
  const hasAdminRole = roles.includes("ADMIN");

  const avatarSrc =
    avatarUrl?.trim() || user?.avatarUrl?.trim() || avatarPlaceholder;
  const displayName = user?.name || "User";
  const displayEmail = user?.email || "No email available";

  const handleToggleSection = (sectionTitle: string) => {
    setOpenSections((current) => ({
      ...current,
      [sectionTitle]: !current[sectionTitle],
    }));
  };

  const handleItemSelect = (to: string) => {
    navigate(to);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authApi.logout();
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label="User account"
        aria-haspopup="menu"
        className="block size-9 overflow-hidden rounded-full border border-slate-200 transition-all hover:ring-2 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <img
          src={avatarSrc}
          alt={displayName}
          className="size-full object-cover"
          onError={(event) => {
            event.currentTarget.src = avatarPlaceholder;
          }}
        />
      </button>

      <div className="invisible absolute right-0 top-full z-50 translate-y-1 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ">
        <div
          role="menu"
          className="h-92.5 max-h-[calc(100vh-5.5rem)] w-[min(calc(100vw-2rem),400px)] overflow-y-auto rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/15 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-center gap-4 border-b border-slate-200 px-5 py-4">
            <img
              src={avatarSrc}
              alt={displayName}
              className="size-16 shrink-0 rounded-full border border-slate-200 object-cover"
              onError={(event) => {
                event.currentTarget.src = avatarPlaceholder;
              }}
            />
            <div className="min-w-0">
              <p className="truncate text-[16px] font-semibold text-slate-800">
                {displayName}
              </p>
              <p className="mt-1 truncate text-sm font-medium text-slate-500">
                {displayEmail}
              </p>
            </div>
          </div>

          <div>
            {accountMenuSections.map((section) => (
              <AccountDropdownSection
                key={section.title}
                section={section}
                isOpen={openSections[section.title] ?? true}
                onToggle={() => handleToggleSection(section.title)}
                onItemSelect={handleItemSelect}
              />
            ))}
          </div>

          {hasAdminRole && mode !== "ADMIN" && (
            <div className="border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                role="menuitem"
                onClick={() => handleItemSelect("/admin/dashboard")}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary/10 text-sm font-bold text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <PanelTop className="size-4" />
                Open Admin Panel
              </button>
            </div>
          )}

          <div className="px-5 pb-5 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-100 text-base font-bold text-slate-700 transition-colors hover:bg-slate-300 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-60"
            >
              <LogOut className="size-5" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAvatarMenu;
