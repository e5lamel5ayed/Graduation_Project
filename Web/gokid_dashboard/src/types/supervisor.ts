import { ApiResponse } from './shared';

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

export interface SupervisorFormData {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatarFile?: File;
  avatarUrl?: string;
}


export { type ApiResponse };

