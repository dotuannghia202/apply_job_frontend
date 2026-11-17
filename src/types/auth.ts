export type RoleName = "ADMIN" | "EMPLOYER" | "CANDIDATE";

export interface AuthUser {
  id: number | string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isActive?: boolean | null;
  roles: Array<RoleName>;
  company: {
    id: number | string;
    name: string;
  } | null;
  isGmailLinked?: boolean | null;
  preferredLanguage?: string | null;
}


export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
