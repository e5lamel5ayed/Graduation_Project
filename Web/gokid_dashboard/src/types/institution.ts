export interface InstitutionListItem {
  id: string;
  name: string;
  code?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  adminName?: string;
  adminEmail?: string;
  website ?: string;
  adminPhoneNumber?: string;
  classCount: number;
  studentCount: number;
  supervisorCount: number;
  createdAt: string;
}

export interface InstitutionListResponse {
  items: InstitutionListItem[];
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface SupervisorSummary {
  id?: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  assignedClassesCount: number;
}

export interface ClassSummary {
  id?: string;
  name?: string;
  childrenCount: number;
  supervisorsCount: number;
  createdAt: string;
}

export interface InstitutionDetails {
  id?: string;
  name?: string;
  code?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  adminId?: string;
  adminName?: string;
  adminEmail?: string;
  classCount: number;
  studentCount: number;
  supervisorCount: number;
  createdAt: string;
  supervisors?: SupervisorSummary[];
  classes?: ClassSummary[];
}

export interface AssignedClassInfo {
  classId?: string;
  className?: string;
  childrenCount: number;
}

export interface InstitutionSupervisorProfile {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  institutionId?: string;
  institutionName?: string;
  assignedClasses?: AssignedClassInfo[];
  createdAt: string;
}

export interface InstitutionQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateInstitutionDto {
  Name: string;
  AdminFullName: string;
  AdminEmail: string;
  PhoneNumber: string;
  Address: string;
  City: string;
  Country: string;
  Website: string;
  Description: string;
  Logo?: File | null;
}

export interface UpdateInstitutionDto {
  Name: string;
  PhoneNumber: string;
  Address: string;
  City: string;
  Country: string;
  Website: string;
  Description: string;
  Logo?: File | null;
}

export interface ApiResponse<T> {
  statusCode: string;
  succeeded: boolean;
  message?: string;
  errors?: string[] | null;
  data: T;
}