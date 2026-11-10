import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";
import authApi from "./authentication/authApi";
import i18n from "@/i18n";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
      return;
    }

    request.resolve();
  });
  failedQueue = [];
};

const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const publicAuthEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/refresh",
  "/auth/logout",
  "/auth/google",
];

const publicCatalogGetEndpoints = [
  "/industries",
  "/specializations",
  "/skills",
];

function isPublicRequest(config?: RetryRequestConfig): boolean {
  if (!config) return false;
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();

  if (publicAuthEndpoints.some((endpoint) => url.includes(endpoint))) {
    return true;
  }

  if (method === "get") {
    if (publicCatalogGetEndpoints.some((endpoint) => url.includes(endpoint))) {
      return true;
    }
    // Public job search & details (excluding employer /jobs/hr)
    if (url.includes("/jobs") && !url.includes("/jobs/hr")) {
      return true;
    }
    // Public company detail (excluding admin/employer endpoints)
    if (
      url.includes("/companies/") &&
      !url.includes("/companies/dashboard-stats") &&
      !url.includes("/companies/my-company")
    ) {
      return true;
    }
  }

  return false;
}

function clearAuthAndRedirect() {
  if (!useAuthStore.getState().isAuthenticated) return;

  useAuthStore.getState().logout();

  const publicPaths = [
    "/",
    "/jobs",
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-settings",
    "/accessibility",
    "/support",
    "/login",
    "/register",
    "/forgot-password",
    "/401",
    "/403",
  ];
  const currentPath = window.location.pathname;
  const isPublic =
    publicPaths.some((p) => currentPath === p) ||
    currentPath.startsWith("/jobs/") ||
    currentPath.startsWith("/company/detail/");

  if (!isPublic) {
    window.location.href = "/login";
  }
}

axiosClient.interceptors.request.use(
  (config) => {
    const currentLang = i18n.language || localStorage.getItem("i18nextLng") || "vi";
    config.headers["Accept-Language"] = currentLang;
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response.config?.responseType === "blob") return response;
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const url = originalRequest.url || "";

    if (status === 401 && !originalRequest._retry) {
      // If it's a public endpoint (auth or public catalog GET), do not attempt token refresh
      if (isPublicRequest(originalRequest)) {
        if (url.includes("/auth/refresh")) clearAuthAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosClient(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authApi.refreshToken();
        processQueue();
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
