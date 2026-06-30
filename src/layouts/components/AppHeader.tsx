import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchAccountInfo } from "@/api/users/user.api";
import { useUpdateUserRoles } from "@/api/users/user.queries";
import { Switch } from "@/components/ui/switch";
import { normalizeRoles } from "@/helper/auth-roles";
import { cn } from "@/lib/utils";
import NotificationDropdown from "@/layouts/components/NotificationDropdown";
import UserAvatarMenu from "@/layouts/components/UserAvatarMenu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import type { RoleName } from "@/types/auth";
import LanguageSwitch from "./LanguageSwitch";

type HeaderNavLink = {
  label: string;
  to: string;
  end?: boolean;
};

const employerModePaths = ["/employer", "/jobs/jd-generator"];
const adminModePaths = ["/admin", "/analytics/system"];

function getHeaderMode(pathname: string, roles: RoleName[]): RoleName {
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

function replaceCandidateEmployerRole(
  roles: RoleName[],
  nextRole: "CANDIDATE" | "EMPLOYER",
) {
  const otherRoles = roles.filter(
    (role) => role !== "CANDIDATE" && role !== "EMPLOYER",
  );

  return [...otherRoles, nextRole];
}

const AppHeader = () => {
  const { t } = useTranslation();

  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const setAuth = useAuthStore((state) => state.setAuth);
  const updateUserRolesMutation = useUpdateUserRoles();
  const roles = user?.roles ?? [];
  const mode = getHeaderMode(location.pathname, roles);

  // 🚨 CHUYỂN LOGIC GET LINKS VÀO ĐÂY ĐỂ DÙNG HÀM t()
  const getNavLinks = (currentMode: RoleName): HeaderNavLink[] => {
    if (currentMode === "ADMIN") {
      return [
        {
          label: t("header.adminDashboard", "Dashboard"),
          to: "/admin/dashboard",
          end: true,
        },
        {
          label: t("header.userManagement", "User Management"),
          to: "/admin/users",
        },
        {
          label: t("header.companyManagement", "Company Management"),
          to: "/admin/companies",
        },
        {
          label: t("header.systemSetting", "System Setting"),
          to: "/admin/system-setting",
        },
      ];
    }
    if (currentMode === "EMPLOYER") {
      return [
        {
          label: t("header.employerDashboard", "Dashboard"),
          to: "/employer/dashboard",
          end: true,
        },
        {
          label: t("header.applicants", "Applicants"),
          to: "/employer/applicants",
        },
        { label: t("header.myJobs", "My Jobs"), to: "/employer/jobs" },
        { label: t("header.postJob", "Post a Job"), to: "/jobs/jd-generator" },
      ];
    }

    // Mặc định là CANDIDATE
    return [
      { label: t("header.findJobs", "Find Jobs"), to: "/jobs", end: true },
      {
        label: t("header.myApplications", "My Applications"),
        to: "/applications",
      },
      { label: t("header.myCv", "My CV"), to: "/my-cv" },
      { label: t("header.savedJobs", "Saved Jobs"), to: "/jobs/saved" },
    ];
  };

  const navLinks = isAuthenticated
    ? getNavLinks(mode)
    : [
        {
          label: t("header.findJobs", "Find Jobs"),
          to: "/jobs",
          end: true,
        },
      ];

  const canSwitchCandidateEmployer = mode !== "ADMIN";
  const isEmployerMode = mode === "EMPLOYER";
  const isModeSwitchPending =
    isSwitchingRole || updateUserRolesMutation.isPending;

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleModeChange = (checked: boolean) => {
    if (!user || isModeSwitchPending) return;

    const nextRole: "CANDIDATE" | "EMPLOYER" = checked
      ? "EMPLOYER"
      : "CANDIDATE";
    const nextRoles = replaceCandidateEmployerRole(roles, nextRole);

    const updateRole = async () => {
      setIsSwitchingRole(true);

      try {
        const response = await updateUserRolesMutation.mutateAsync({
          id: user.id,
          data: {
            roles: nextRoles,
          },
        });

        const responseRoles = normalizeRoles(response.data?.roles);
        const updatedRoles =
          responseRoles.length > 0 ? responseRoles : nextRoles;

        const profileResponse = await fetchAccountInfo();
        const profileData = profileResponse.data ?? null;
        const profile =
          profileData && "user" in profileData ? profileData.user : profileData;

        if (profile) {
          setAuth({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            avatarUrl: profile.avatarUrl ?? null,
            isActive: profile.isActive ?? null,
            roles: normalizeRoles(profile.roles ?? []),
            company: profile.company ?? null,
          });
        } else {
          setAuth({
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl ?? null,
            isActive: user.isActive ?? null,
            roles: updatedRoles,
            company: user.company ?? null,
          });
        }

        const hasCompany = Boolean(profile?.company?.id ?? user.company?.id);
        const targetPath =
          nextRole === "EMPLOYER"
            ? hasCompany
              ? "/employer/dashboard"
              : "/employer/onboarding/company"
            : "/jobs";

        if (nextRole === "CANDIDATE") {
          navigate(targetPath, { replace: true, flushSync: true });
          return;
        }
        navigate(targetPath, { replace: true, flushSync: true });
      } catch (error) {
        console.error("Failed to switch user role", error);
      } finally {
        setIsSwitchingRole(false);
      }
    };

    void updateRole();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 md:gap-8">
            {/* Nút Hamburger Menu (Mobile) */}
            {navLinks.length > 0 && (
              <button
                type="button"
                className="block rounded-md p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </button>
            )}

            <Link
              to="/"
              className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary hover:opacity-90"
            >
              Job Portal
            </Link>

            {/* Thanh Menu (Desktop) */}
            <div className="hidden gap-6 md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "border-b-2 py-1 text-sm font-semibold transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-slate-600 hover:text-primary",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitch />

            {!isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="rounded-full border-primary text-primary hover:bg-primary/5 px-5 py-2 text-sm font-semibold transition-colors"
                  onClick={() => navigate("/register")}
                >
                  {t("header.register", "Register")}
                </Button>
                <Button
                  className="rounded-full bg-primary text-white hover:bg-primary/95 px-5 py-2 text-sm font-semibold transition-colors"
                  onClick={() => navigate("/login")}
                >
                  {t("header.login", "Log In")}
                </Button>
              </div>
            ) : (
              <>
                {/* Nút Switch Role */}
                {canSwitchCandidateEmployer && (
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 sm:px-3 sm:py-1.5">
                    <span
                      className={cn(
                        "hidden text-xs font-semibold transition-colors lg:inline",
                        !isEmployerMode ? "text-primary" : "text-slate-500",
                      )}
                    >
                      {t("header.candidate", "Candidate")}
                    </span>
                    <Switch
                      checked={isEmployerMode}
                      onCheckedChange={handleModeChange}
                      disabled={isModeSwitchPending}
                      aria-busy={isModeSwitchPending}
                      aria-label="Switch between candidate and employer mode"
                    />
                    <span
                      className={cn(
                        "hidden text-xs font-semibold transition-colors lg:inline",
                        isEmployerMode ? "text-primary" : "text-slate-500",
                      )}
                    >
                      {t("header.employer", "Employer")}
                    </span>
                  </div>
                )}

                {/* Nút Notification */}
                <NotificationDropdown currentRole={mode} />

                <UserAvatarMenu />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu Xổ Xuống (Mobile) */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-slate-200 bg-white shadow-lg md:hidden">
          <div className="flex flex-col px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppHeader;
