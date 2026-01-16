export type LoginAs = 'PlatformAdmin' | 'InstitutionAdmin' | 'Parent';

export interface LoginDto {
  identifier: string;
  password: string;
  loginAs: LoginAs;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface LoginResponse {
  id: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email?: string;
  token: string;
  refreshToken?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
