import type { User } from "./user";

export type RoleName = "ADMIN" | "EMPLOYER" | "CANDIDATE";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  roles: Array<RoleName>;
}

export interface LoginRequest {
  username: String;
  password: String;
}

export interface LoginResponse {
  access_token: String;
  user: User;
}

export interface RegisterRequest {
  name: String;
  email: String;
}
