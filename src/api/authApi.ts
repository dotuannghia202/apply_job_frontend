import axiosClient from "./axiosClient";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";

import type { User } from "../types/user";
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

  getProfile(): Promise<BackendResponse<User>> {
    const url = `/auth/account`;
    return axiosClient.get(url);
  },

  logout(): Promise<BackendResponse<void>> {
    const url = `/auth/logout`;
    return axiosClient.post(url);
  },
};

export default authApi;
