import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

import RequireAuth from "./guards/RequireAuth";
import RequireRoles from "./guards/RequireRoles";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

import NotFoundPage from "@/pages/errors/NotFoundPage";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";
import AuthRequiredPage from "@/pages/errors/AuthRequiredPage";

import AdminDashboardPage from "@/pages/admin/dashboard/DashboardPage";

import { normalizeRoles } from "@/helper/auth-roles";
import type { RoleName } from "@/types/auth";
import JobListPage from "@/pages/jobs/list-jobs/JobListPage";
import EmployerDashboard from "@/pages/employer/dashboard/EmployerDashboardPage";
import EmployerApplicationsPage from "@/pages/employer/applications-my-company/EmployerApplicationsPage";
import EmployerJobsPage from "@/pages/employer/jobs-my-company/EmployerJobsPage";
import PostJobPage from "@/pages/employer/post-job/PostJobPage";
import CreateCompanyPage from "@/pages/employer/create-company/CreateCompanyPage";
import JobDetailPage from "@/pages/jobs/job-detail/JobDetailPage";
import AIGenerationJob from "@/pages/employer/post-job/AIGenerationJob";
import MyCV from "@/pages/candidate/cvs/MyCV";
import SavedJobPage from "@/pages/candidate/saved-jobs/SavedJobPage";

import MyApplicationsList from "@/pages/candidate/my-applications/MyApplicationsList";
import MyApplicationDetail from "@/pages/candidate/my-applications/MyApplicationDetail";

import CVDetailCandidate from "@/pages/candidate/cvs/CVDetailCandidate";
import AccountSettingPage from "@/pages/settings/AccountSettingPage";
import ManageUserPage from "@/pages/candidate/management-users/ManageUserPage";

function getUserRoles(): RoleName[] {
  const rawUser = localStorage.getItem("authUser");
  if (!rawUser) return [];

  try {
    const user = JSON.parse(rawUser);
    return normalizeRoles(user?.roles);
  } catch {
    return [];
  }
}

function getDefaultHomePath(roles: RoleName[]) {
  if (roles.includes("ADMIN")) return "/admin/dashboard";
  if (roles.includes("EMPLOYER")) return "/employer/dashboard";
  if (roles.includes("CANDIDATE")) return "/jobs";
  return "/403";
}

function HomeRedirect() {
  const token = localStorage.getItem("accessToken");
  const roles = getUserRoles();

  if (!token || roles.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDefaultHomePath(roles)} replace />;
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
    </main>
  );
}

export const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
    ],
  },

  // Error pages
  { path: "/401", element: <AuthRequiredPage /> },
  { path: "/403", element: <UnauthorizedPage /> },

  // Protected routes
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomeRedirect />,
          },

          // ADMIN only
          {
            element: <RequireRoles allowedRoles={["ADMIN"]} />,
            children: [
              {
                path: "admin/dashboard",
                element: <AdminDashboardPage />,
              },
              {
                path: "admin/users",
                element: <ManageUserPage />,
              },
              {
                path: "admin/company-approval",
                element: <PlaceholderPage title="Company Approval" />,
              },
              {
                path: "analytics/system",
                element: <PlaceholderPage title="System Analytics" />,
              },
            ],
          },

          // Candidate routes (allow ADMIN too)
          {
            element: <RequireRoles allowedRoles={["CANDIDATE", "ADMIN"]} />,
            children: [
              {
                path: "applications",
                element: <MyApplicationsList />,
              },
              {
                path: "applications/:id",
                element: <MyApplicationDetail />,
              },
              {
                path: "my-cv",
                element: <MyCV />,
              },
              {
                path: "my-cv/:id",
                element: <CVDetailCandidate />,
              },
              {
                path: "jobs/saved",
                element: <SavedJobPage />,
              },
            ],
          },

          // Employer routes (allow ADMIN too)
          {
            element: <RequireRoles allowedRoles={["EMPLOYER", "ADMIN"]} />,
            children: [
              {
                path: "employer/dashboard",
                element: <EmployerDashboard />,
              },
              {
                path: "employer/applicants",
                element: <EmployerApplicationsPage />,
              },
              {
                path: "employer/jobs",
                element: <EmployerJobsPage />,
              },
              {
                path: "employer/onboarding/company",
                element: <CreateCompanyPage />,
              },
            ],
          },

          // ADMIN + EMPLOYER shared
          {
            element: <RequireRoles allowedRoles={["ADMIN", "EMPLOYER"]} />,
            children: [
              {
                path: "jobs/jd-generator",
                element: <AIGenerationJob />,
              },
              {
                path: "jobs/publish",
                element: <PostJobPage />,
              },
            ],
          },

          // Public jobs listing (available to all auth roles)
          {
            element: (
              <RequireRoles allowedRoles={["CANDIDATE", "EMPLOYER", "ADMIN"]} />
            ),
            children: [
              {
                path: "jobs",
                element: <JobListPage />,
              },
              {
                path: "jobs/detail/:id",
                element: <JobDetailPage />,
              },
            ],
          },

          // Shared for all authenticated users
          {
            path: "profile",
            element: <AccountSettingPage />,
          },
          {
            path: "settings",
            element: <AccountSettingPage />,
          },
          {
            path: "change-password",
            element: <AccountSettingPage />,
          },
        ],
      },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);
