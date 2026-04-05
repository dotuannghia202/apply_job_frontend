export interface BackendResponse<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T | null;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
  email?: string;
}
