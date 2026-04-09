import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import RequireAuth from "./guards/RequireAuth";
import RequireRoles from "./guards/RequireRoles";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import NotFoundPage from "@/pages/errors/NotFoundPage";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";
import AuthRequiredPage from "@/pages/errors/AuthRequiredPage";

import AdminSystemAnalyticsPage from "@/pages/stitch/AdminSystemAnalyticsPage";

import EmployerDashboardPage from "@/pages/stitch/RecruiterDashboardPage";
import EmployerJDGeneratorPage from "@/pages/stitch/RecruiterJDGeneratorPage";
import type { RoleName } from "@/types/auth";
import JobListPage from "@/pages/jobs/JobListPage";

// Sau này nếu có AdminDashboardPage riêng thì import thêm:
// import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";

function getUserRoles(): RoleName[] {
  const rawUser = localStorage.getItem("authUser");
  if (!rawUser) return [];

  try {
    const user = JSON.parse(rawUser);
    return user?.roles?.map((r: RoleName) => r) ?? [];
  } catch {
    return [];
  }
}

function getDefaultHomePath(roles: RoleName[]) {
  if (roles.includes("ADMIN")) return "/admin/dashboard";
  if (roles.includes("EMPLOYER")) return "/jobs";
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

export const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
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
                element: <div>Admin Dashboard</div>,
                // Sau này thay bằng:
                // element: <AdminDashboardPage />
              },
              {
                path: "analytics/system",
                element: <AdminSystemAnalyticsPage />,
              },
            ],
          },

          // EMPLOYER only
          {
            element: <RequireRoles allowedRoles={["EMPLOYER"]} />,
            children: [
              {
                path: "employer/dashboard",
                element: <EmployerDashboardPage />,
              },
            ],
          },

          // ADMIN + EMPLOYER shared
          {
            element: <RequireRoles allowedRoles={["ADMIN", "EMPLOYER"]} />,
            children: [
              {
                path: "jobs/jd-generator",
                element: <EmployerJDGeneratorPage />,
              },
            ],
          },

          {
            element: (
              <RequireRoles allowedRoles={["CANDIDATE", "EMPLOYER", "ADMIN"]} />
            ),
            children: [
              {
                path: "jobs",
                element: <JobListPage />,
              },
            ],
          },

          // Shared for all authenticated users
          {
            path: "profile",
            element: <div>Profile Page</div>,
          },
          {
            path: "settings",
            element: <div>Settings Page</div>,
          },
        ],
      },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);
