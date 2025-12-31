export interface LoginRequest {
  username: String;
  password: String;
}

export interface LoginResponse {
  access_token: String;
  user: User;
}

export interface User {
  id: number;
  email: String;
  name: String;
}

export interface BackendResponse<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T;
}
