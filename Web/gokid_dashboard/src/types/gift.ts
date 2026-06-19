import { ApiResponse } from './shared';

export interface GiftImage {
  imageUrl: string;
  publicId?: string;
}

export interface Gift {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  pointsCost: number;
  type: string;
  image?: GiftImage;
}

export interface GiftFormData {
  id?: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  pointsCost: number;
  type: string;
  imageFile?: File | null;
  existingImageUrl?: string | null;
}

export interface CreateGiftDto {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  pointsCost: number;
  type: string;
  image?: File | null;
}

export type UpdateGiftDto = Partial<CreateGiftDto>;

export { type ApiResponse };
