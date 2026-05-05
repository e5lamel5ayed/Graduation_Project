import { ApiResponse, PaginatedResponse } from './shared';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TemplateType = 'InstantReward' | 'TextQuestion' | 'VoiceQuestion' | 'EvidenceSubmission';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ReviewedBy = 'Parent' | 'PlatformAdmin' | 'AI';
export type EvidenceType = 'Image' | 'Video';

export interface InstantRewardFormData {
  id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  basePoints: number;
  difficulty: Difficulty;
  subCategoryId: string;
  taskImageFile: File | null;
  iconFile: File | null;
}

export interface CreateInstantRewardDto {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  taskImageFile?: File | null;
  iconFile?: File | null;
  subCategoryId: string;
  difficulty: Difficulty;
  basePoints: number;
}
export interface VoiceTaskFormData {
  id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  questionText: string;
  expectedCorrectAnswer: string;
  voicePrompt: string;
  maxVoiceAttempts: number;
  maxVoiceDurationSeconds: number;
  subCategoryId: string;
  difficulty: Difficulty;
  basePoints: number;
  taskImageFile: File | null;
  iconFile: File | null;
}
export interface CreateVoiceQuestionDto {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  questionText: string;
  expectedCorrectAnswer: string;
  voicePrompt: string;
  maxVoiceAttempts: number;
  maxVoiceDurationSeconds: number;
  subCategoryId: string;
  difficulty: Difficulty;
  basePoints: number;
  taskImageFile?: File | null;
  iconFile?: File | null;
}

export interface EvidenceSubmissionFormData {
  id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  instructionsText: string;
  evidenceType: EvidenceType;
  reviewBy: ReviewedBy;
  subCategoryId: string;
  difficulty: Difficulty;
  basePoints: number;
  taskImageFile: File | null;
  iconFile: File | null;
}

export interface CreateEvidenceSubmissionDto {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  instructionsText: string;
  evidenceType: EvidenceType;
  reviewBy: ReviewedBy;
  subCategoryId: string;
  difficulty: Difficulty;
  basePoints: number;
  taskImageFile?: File | null;
  iconFile?: File | null;
}

export interface TaskTemplate {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconUrl: string;
  subCategoryId: string;
  subCategoryNameEn: string;
  difficulty: Difficulty;
  basePoints: number;
  templateType: TemplateType;
  createdAt: string;
}

export interface TaskTemplateParams {
  templateType: TemplateType;
  pageNumber?: number;
  pageSize?: number;
}

// Supervisor Adventure Review Task Types
export type AdventureChildTaskStatus = 'Pending' | 'Completed' | 'Missed' | 'Locked';

export interface SupervisorAdventureTask {
  childAdventureTaskId: string;
  childId: string;
  childName: string;
  childAvatarUrl?: string;
  dayNumber: number;
  taskTitleEn: string;
  taskTitleAr: string;
  evidenceUrl?: string;
  status: AdventureChildTaskStatus;
  submittedAt?: string;
  isApproved?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SupervisorTaskReviewDto {
  isApproved: boolean;
  rejectionReason: string;
}

export { type ApiResponse, type PaginatedResponse };

