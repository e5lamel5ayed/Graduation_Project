/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '../lib/axios';
import { TaskTemplate, TaskTemplateParams, PaginatedResponse, ApiResponse, CreateInstantRewardDto, CreateEvidenceSubmissionDto, CreateVoiceQuestionDto } from '../types/task';

// Helper function to convert object to FormData
const toFormData = (obj: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      // Handle File objects
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== '') {
        formData.append(key, value.toString());
      }
    }
  });
  return formData;
};

export const taskService = {
  // Get task templates by type
  getTaskTemplates: async (params: TaskTemplateParams) => {
    const { data } = await axiosInstance.get<ApiResponse<PaginatedResponse<TaskTemplate>>>('/task-templates', {
      params: {
        TemplateType: params.templateType,
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10,
      },
    });
    return data.data;
  },

  // Create instant reward task
  createInstantReward: async (taskData: CreateInstantRewardDto) => {
    const formData = toFormData({
      TitleAr: taskData.titleAr,
      TitleEn: taskData.titleEn,
      DescriptionAr: taskData.descriptionAr,
      DescriptionEn: taskData.descriptionEn,
      TaskImageFile: taskData.taskImageFile,
      IconFile: taskData.iconFile,
      SubCategoryId: taskData.subCategoryId,
      Difficulty: taskData.difficulty,
      BasePoints: taskData.basePoints,
    });

    const { data } = await axiosInstance.post<ApiResponse<TaskTemplate>>(
      '/task-templates/instant-reward',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.data;
  },

    // Create EvidenceSubmission task
  createEvidenceSubmission: async (taskData: CreateEvidenceSubmissionDto) => {
    const formData = toFormData({
      TitleAr: taskData.titleAr,
      TitleEn: taskData.titleEn,
      DescriptionAr: taskData.descriptionAr,
      DescriptionEn: taskData.descriptionEn,
      InstructionsText: taskData.instructionsText,
      EvidenceType: taskData.evidenceType,
      ReviewBy: taskData.reviewBy,
      SubCategoryId: taskData.subCategoryId,
      Difficulty: taskData.difficulty,
      BasePoints: taskData.basePoints,
      TaskImageFile: taskData.taskImageFile,
      IconFile: taskData.iconFile,
    });

    const { data } = await axiosInstance.post<ApiResponse<TaskTemplate>>(
      '/task-templates/evidence-submission',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.data;
  },

  createVoiceQuestion: async (taskData: CreateVoiceQuestionDto) => {
    const formData = toFormData({
      TitleAr: taskData.titleAr,
      TitleEn: taskData.titleEn,
      DescriptionAr: taskData.descriptionAr,
      DescriptionEn: taskData.descriptionEn,
      QuestionText: taskData.questionText,
      ExpectedCorrectAnswer: taskData.expectedCorrectAnswer,
      VoicePrompt: taskData.voicePrompt,
      MaxVoiceAttempts: taskData.maxVoiceAttempts,
      MaxVoiceDurationSeconds: taskData.maxVoiceDurationSeconds,
      SubCategoryId: taskData.subCategoryId,
      Difficulty: taskData.difficulty,
      BasePoints: taskData.basePoints,
      TaskImageFile: taskData.taskImageFile,
      IconFile: taskData.iconFile,
    });

    const { data } = await axiosInstance.post<ApiResponse<TaskTemplate>>(
      '/task-templates/voice-question',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.data;
  },
};
