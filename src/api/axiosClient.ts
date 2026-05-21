import axios, { type InternalAxiosRequestConfig } from "axios";
import authApi from "./authApi";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
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
];

function isPublicEndpoint(url?: string) {
  return publicEndpoints.some((endpoint) => url?.includes(endpoint));
}

function clearAuthAndRedirect() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authUser");
  window.location.href = "/401";
}

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && config.headers && !isPublicEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response.config?.responseType === "blob") {
      return response;
    }

    return response.data;
  },

  async (error) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = originalRequest.url || "";

    if (status === 401 && !originalRequest._retry) {
      // Do not refresh for login / register / refresh.
      if (isPublicEndpoint(url)) {
        if (url.includes("/auth/refresh")) {
          clearAuthAndRedirect();
        }

        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        /**
         * The backend currently uses @GetMapping("/refresh"), so this must use GET.
         *
         * If the backend changes to @PostMapping("/refresh"), change this to:
         * const refreshResponse = await axiosClient.post<RefreshTokenResponse>("/auth/refresh");
         */
        const refreshResponse = await authApi.refreshToken();

        const newAccessToken = refreshResponse.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Missing accessToken from refresh response");
        }

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
