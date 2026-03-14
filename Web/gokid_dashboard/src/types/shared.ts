/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T> {
  statusCode?: string;
  succeeded?: boolean;
  success?: boolean;
  message?: string;
  errors?: any[] | null;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  totalCountItems?: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
