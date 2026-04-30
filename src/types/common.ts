export interface BackendResponse<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T | null;
}

export interface QueryParams {
  page?: number;
  size?: number;
  name?: string;
  email?: string;
}

export interface Pagination<T> {
  result: T[];
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}
