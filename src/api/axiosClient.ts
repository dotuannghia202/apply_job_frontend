import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";
import authApi from "./authApi";

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

const publicEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/refresh",
  "/auth/logout",
];

function isPublicEndpoint(url?: string) {
  return publicEndpoints.some((endpoint) => url?.includes(endpoint));
}

function clearAuthAndRedirect() {
  if (!useAuthStore.getState().isAuthenticated) return;

  useAuthStore.getState().logout();
  window.location.href = "/401";
}

axiosClient.interceptors.request.use(
  (config) => config,
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
      if (!useAuthStore.getState().isAuthenticated) {
        return Promise.reject(error);
      }

      if (isPublicEndpoint(url)) {
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
