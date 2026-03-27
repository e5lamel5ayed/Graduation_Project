export interface Supervisor {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl?: string;
}

export interface CreateSupervisorDto {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  avatarFile?: File;
}

export interface UpdateSupervisorDto {
  email?: string;
  fullName?: string;
  password?: string;
  phoneNumber?: string;
  avatarFile?: File;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
