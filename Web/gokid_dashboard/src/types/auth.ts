import { ApiResponse } from './shared';

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

export interface LoginCredentials {
  identifier: string;
  password: string;
  loginAs: 'PlatformAdmin' | 'InstitutionAdmin';
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  displayName: string;
  email: string;
  userType: string;
  childId: string | null;
  parentId: string | null;
}

export interface LoginResponse {
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: LoginData;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export { type ApiResponse };

