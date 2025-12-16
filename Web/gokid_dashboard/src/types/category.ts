/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CategoryIcon {
  url: string;
  publicId?: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  colorHex: string;
  subCategoriesCount: number;
  icon?: CategoryIcon;
}

export interface CategoryDetail extends Category {
  iconFile: string;
}

export interface CreateCategoryDto {
  nameAr: string;
  nameEn: string;
  iconFile?: File | null;
  colorHex: string;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export interface ApiResponse<T> {
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: any[] | null;
  data: T;
}
