import axiosClient from "./axiosClient";
import type {
  BackendResponse,
  LoginRequest,
  LoginResponse,
  User,
} from "../types/auth";

const authApi = {
  login(data: LoginRequest): Promise<BackendResponse<LoginResponse>> {
    const url = `/auth/login`;
    return axiosClient.post(url, data);
  },

  register(data: any): Promise<any> {
    const url = `/auth/register`;
    return axiosClient.post(url, data);
  },

  getProfile(): Promise<User> {
    const url = `/auth/me`;
    return axiosClient.get(url);
  },

  logout(): Promise<void> {
    const url = `/auth/logout`;
    return axiosClient.post(url);
  },
};

export default authApi;
