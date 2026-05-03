export type RoleName = "ADMIN" | "EMPLOYER" | "CANDIDATE";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string | null;
  roles: Array<RoleName>;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
}
