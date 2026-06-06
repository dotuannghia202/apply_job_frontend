import axios, { type InternalAxiosRequestConfig } from "axios";
import authApi from "./authApi";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// --- CÁC BIẾN DÙNG ĐỂ XỬ LÝ HÀNG ĐỢI (QUEUE) KHI REFRESH TOKEN ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
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

      // 1. NẾU ĐANG CÓ REQUEST KHÁC ĐI LẤY TOKEN RỒI -> CHO VÀO HÀNG ĐỢI
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      // 2. NẾU CHƯA CÓ AI ĐI LẤY -> KHÓA LẠI ĐỂ MÌNH ĐI LẤY
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await authApi.refreshToken();

        const newAccessToken = refreshResponse.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Missing accessToken from refresh response");
        }

        //Lưu token mới
        localStorage.setItem("accessToken", newAccessToken);

        // Gắn token mới vào request bị lỗi
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Xử lý thành công -> Lấy token báo cho các request đang xếp hàng
        processQueue(null, newAccessToken);

        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Nếu việc lấy token thất bại -> Báo lỗi cho cả hàng đợi và log out
        processQueue(refreshError, null);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        // Luôn mở khoá dù thành công hay thất bại
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
