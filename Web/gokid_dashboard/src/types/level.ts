export interface Level {
  id?: string;
  name?: string;
  order: number;
  minPoints: number;
  badgeUrl?: string;
  createdAt: string;
}

export interface CreateLevelDto {
  Name: string;
  Order: number;
  MinPoints: number;
  Badge?: File | null;
}

export type UpdateLevelDto = Partial<CreateLevelDto>;

export interface ApiResponse<T> {
  statusCode: string;
  succeeded: boolean;
  message?: string;
  errors?: string[] | null;
  data: T;
}
