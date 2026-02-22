export interface Class {
  id: string;
  name: string;
}

export interface CreateClassDto {
  name: string;
}

export interface UpdateClassDto {
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
