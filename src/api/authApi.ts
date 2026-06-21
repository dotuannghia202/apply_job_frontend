import axiosClient from "./axiosClient";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";

import type { BackendResponse } from "@/types/common";
const authApi = {
  login(data: LoginRequest): Promise<BackendResponse<LoginResponse>> {
    const url = `/auth/login`;
    return axiosClient.post(url, data) as Promise<
      BackendResponse<LoginResponse>
    >;
  },

  register(data: RegisterRequest): Promise<BackendResponse<void>> {
    const url = `/auth/register`;
    return axiosClient.post(url, data);
  },

  forgotPassword(data: ForgotPasswordRequest): Promise<BackendResponse<void>> {
    const url = `/auth/forgot-password`;
    return axiosClient.post(url, data);
  },

  refreshToken(): Promise<BackendResponse<void>> {
    const url = `/auth/refresh`;
    return axiosClient.get(url) as Promise<BackendResponse<void>>;
  },

  logout(): Promise<BackendResponse<void>> {
    const url = `/auth/logout`;
    return axiosClient.post(url);
  },
};

export default authApi;
