/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '../lib/axios';
import {
    Adventure,
    AdventureApiModel,
    AdventureBuilderData,
    AssignAdventureToClassDto,
    AdventureQueryParams,
    CreateAdventureDto,
    UpdateAdventureDto,
    SupervisorAdventure,
    SupervisorAdventureApiModel,
    SupervisorAdventureClass,
    SupervisorAdventureChild,
    SupervisorChildHistory,
} from '../types/adventure';
import { ApiResponse } from '../types/category';
import { PaginatedResponse, SupervisorAdventureTask, SupervisorTaskReviewDto } from '../types/task';

const BASE_PATH = '/Adventure';

const appendValue = (formData: FormData, key: string, value: unknown) => {
    if (value === null || value === undefined) return;

    if (value instanceof File) {
        formData.append(key, value);
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
                Object.entries(item as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
                    appendValue(formData, `${key}[${index}].${nestedKey}`, nestedValue);
                });
            } else {
                appendValue(formData, `${key}[${index}]`, item);
            }
        });
        return;
    }

    if (typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
            appendValue(formData, `${key}.${nestedKey}`, nestedValue);
        });
        return;
    }

    const valueAsString = String(value);
    if (valueAsString !== '') {
        formData.append(key, valueAsString);
    }
};

const toFormData = (obj: Record<string, unknown>): FormData => {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => appendValue(formData, key, value));
    return formData;
};

const mapAdventure = (adventure: AdventureApiModel): Adventure => {
    const title = adventure.title ?? adventure.titleEn ?? adventure.titleAr ?? 'Untitled Adventure';
    const description = adventure.description ?? adventure.descriptionEn ?? adventure.descriptionAr ?? '';
    const weekDuration = adventure.weekDuration ?? 7;
    const taskCount = adventure.tasks?.length ?? 0;

    return {
        id: adventure.id,
        title,
        description,
        days: weekDuration,
        taskCount,
        goal: `Bonus Points: ${adventure.bonusPoints ?? 0}`,
        createdAt: adventure.createdAt ?? new Date().toISOString(),
        category: adventure.status ?? 'Adventure',
        status: adventure.status,
    };
};

const mapSupervisorAdventure = (adventure: SupervisorAdventureApiModel): SupervisorAdventure => {
    const title = adventure.titleEn?.trim() || adventure.titleAr?.trim() || 'Untitled Adventure';

    return {
        weeklyAdventureId: adventure.weeklyAdventureId,
        adventureId: adventure.adventureId,
        title,
        titleEn: adventure.titleEn,
        titleAr: adventure.titleAr,
        className: adventure.className,
        classId: adventure.classId,
        startDate: adventure.startDate,
        endDate: adventure.endDate,
        totalChildren: adventure.totalChildren,
        pendingReviewsCount: adventure.pendingReviewsCount,
    };
};

const normalizeListResponse = (payload: unknown): AdventureApiModel[] => {
    if (Array.isArray(payload)) {
        return payload as AdventureApiModel[];
    }

    if (payload && typeof payload === 'object') {
        const dataPayload = (payload as Record<string, any>).data;

        if (Array.isArray(dataPayload)) {
            return dataPayload as AdventureApiModel[];
        }

        if (dataPayload && typeof dataPayload === 'object' && Array.isArray((dataPayload as Record<string, any>).items)) {
            return (dataPayload as Record<string, any>).items as AdventureApiModel[];
        }

        if (Array.isArray((payload as Record<string, any>).items)) {
            return (payload as Record<string, any>).items as AdventureApiModel[];
        }
    }

    return [];
};

const normalizeSingleResponse = (payload: unknown): AdventureApiModel | null => {
    if (payload && typeof payload === 'object') {
        const record = payload as Record<string, any>;

        if (record.data && typeof record.data === 'object') {
            return record.data as AdventureApiModel;
        }

        if (record.id) {
            return record as AdventureApiModel;
        }
    }

    return null;
};

const normalizeSupervisorListResponse = (payload: unknown): SupervisorAdventureApiModel[] => {
    if (Array.isArray(payload)) {
        return payload as SupervisorAdventureApiModel[];
    }

    if (payload && typeof payload === 'object') {
        const dataPayload = (payload as Record<string, any>).data;

        if (Array.isArray(dataPayload)) {
            return dataPayload as SupervisorAdventureApiModel[];
        }

        if (dataPayload && typeof dataPayload === 'object' && Array.isArray((dataPayload as Record<string, any>).items)) {
            return (dataPayload as Record<string, any>).items as SupervisorAdventureApiModel[];
        }

        if (Array.isArray((payload as Record<string, any>).items)) {
            return (payload as Record<string, any>).items as SupervisorAdventureApiModel[];
        }
    }

    return [];
};

const normalizePaginatedResponse = <T>(payload: unknown): T[] => {
    if (Array.isArray(payload)) {
        return payload as T[];
    }

    if (payload && typeof payload === 'object') {
        const record = payload as Record<string, any>;

        if (Array.isArray(record.data)) {
            return record.data as T[];
        }

        if (Array.isArray(record.items)) {
            return record.items as T[];
        }

        if (record.data && typeof record.data === 'object') {
            const dataRecord = record.data as Record<string, any>;

            if (Array.isArray(dataRecord.items)) {
                return dataRecord.items as T[];
            }

            if (Array.isArray(dataRecord.data)) {
                return dataRecord.data as T[];
            }
        }
    }

    return [];
};

const normalizeClassListResponse = (payload: unknown): SupervisorAdventureClass[] => {
    if (Array.isArray(payload)) {
        return payload as SupervisorAdventureClass[];
    }

    if (payload && typeof payload === 'object') {
        const record = payload as Record<string, any>;

        if (Array.isArray(record.data)) {
            return record.data as SupervisorAdventureClass[];
        }

        if (Array.isArray(record.items)) {
            return record.items as SupervisorAdventureClass[];
        }

        if (record.data && typeof record.data === 'object') {
            const dataRecord = record.data as Record<string, any>;

            if (Array.isArray(dataRecord.items)) {
                return dataRecord.items as SupervisorAdventureClass[];
            }

            if (Array.isArray(dataRecord.data)) {
                return dataRecord.data as SupervisorAdventureClass[];
            }
        }
    }

    return [];
};

const getTaskTemplateId = (task: Record<string, unknown>): string | null => {
    const candidateKeys = ['taskTemplateId', 'taskTemplateID', 'templateId', 'taskId', 'id'];
    for (const key of candidateKeys) {
        const value = task[key];
        if (typeof value === 'string' && value.trim() !== '') {
            return value;
        }
    }
    return null;
};

const mapToBuilderData = (adventure: AdventureApiModel): AdventureBuilderData => {
    const tasks = (adventure.tasks ?? [])
        .map((task) => {
            const taskRecord = task as unknown as Record<string, unknown>;
            const taskTemplateId = getTaskTemplateId(taskRecord);
            const dayNumber = typeof task.dayNumber === 'number' ? task.dayNumber : null;

            if (!taskTemplateId || !dayNumber) {
                return null;
            }

            return {
                dayNumber,
                taskTemplateId,
            };
        })
        .filter((task): task is { dayNumber: number; taskTemplateId: string } => Boolean(task));

    return {
        id: adventure.id,
        title: adventure.title ?? adventure.titleEn ?? adventure.titleAr ?? '',
        titleEn: adventure.titleEn ?? adventure.title ?? '',
        titleAr: adventure.titleAr ?? '',
        description: adventure.description ?? adventure.descriptionEn ?? adventure.descriptionAr ?? '',
        descriptionEn: adventure.descriptionEn ?? adventure.description ?? '',
        descriptionAr: adventure.descriptionAr ?? '',
        goalEn: (adventure as Record<string, any>).goalEn ?? '',
        goalAr: (adventure as Record<string, any>).goalAr ?? '',
        weekDuration: adventure.weekDuration ?? 7,
        bonusPoints: adventure.bonusPoints ?? 0,
        tasks,
        rawTasks: adventure.tasks ?? [],
    };
};

export const adventureService = {
    getAll: async (params: AdventureQueryParams = {}): Promise<Adventure[]> => {
        const { data } = await axiosInstance.get<ApiResponse<AdventureApiModel[]> | AdventureApiModel[]>(BASE_PATH, {
            params: {
                SearchTitle: params.searchTitle || undefined,
                Status: params.status || undefined,
            },
        });

        return normalizeListResponse(data).map(mapAdventure);
    },

    getSupervisorAdventures: async (): Promise<SupervisorAdventure[]> => {
        const { data } = await axiosInstance.get<ApiResponse<SupervisorAdventureApiModel[]> | SupervisorAdventureApiModel[]>('/supervisor/adventures');

        return normalizeSupervisorListResponse(data).map(mapSupervisorAdventure);
    },

    create: async (adventureData: CreateAdventureDto) => {
        const formData = toFormData({
            Title: adventureData.title,
            TitleEn: adventureData.titleEn,
            TitleAr: adventureData.titleAr,
            Description: adventureData.description,
            DescriptionEn: adventureData.descriptionEn,
            DescriptionAr: adventureData.descriptionAr,
            GoalEn: adventureData.goalEn,
            GoalAr: adventureData.goalAr,
            BannerImage: adventureData.bannerImage,
            WeekDuration: adventureData.weekDuration ?? 7,
            BonusPoints: adventureData.bonusPoints ?? 0,
            DescriptionVoiceFile: adventureData.descriptionVoiceFile,
            Tasks: adventureData.tasks.map((task) => ({
                DayNumber: task.dayNumber,
                TaskTemplateId: task.taskTemplateId,
            })),
        });

        const { data } = await axiosInstance.post<ApiResponse<AdventureApiModel>>(
            BASE_PATH,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return data.data;
    },

    getById: async (adventureId: string): Promise<AdventureBuilderData> => {
        const { data } = await axiosInstance.get<ApiResponse<AdventureApiModel> | AdventureApiModel>(`${BASE_PATH}/${adventureId}`);
        const normalized = normalizeSingleResponse(data);

        if (!normalized) {
            throw new Error('Adventure details response is invalid');
        }

        return mapToBuilderData(normalized);
    },

    update: async (adventureId: string, adventureData: UpdateAdventureDto) => {
        const formData = toFormData({
            Title: adventureData.title,
            TitleEn: adventureData.titleEn,
            TitleAr: adventureData.titleAr,
            Description: adventureData.description,
            DescriptionEn: adventureData.descriptionEn,
            DescriptionAr: adventureData.descriptionAr,
            GoalEn: adventureData.goalEn,
            GoalAr: adventureData.goalAr,
            BannerImage: adventureData.bannerImage,
            WeekDuration: adventureData.weekDuration ?? 7,
            BonusPoints: adventureData.bonusPoints ?? 0,
            DescriptionVoiceFile: adventureData.descriptionVoiceFile,
            Tasks: adventureData.tasks.map((task) => ({
                DayNumber: task.dayNumber,
                TaskTemplateId: task.taskTemplateId,
            })),
        });

        const { data } = await axiosInstance.put<ApiResponse<AdventureApiModel>>(
            `${BASE_PATH}/${adventureId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return data.data;
    },

    updateStatus: async (adventureId: string, status: 'Active' | 'Inactive') => {
        const { data } = await axiosInstance.patch<ApiResponse<AdventureApiModel>>(
            `${BASE_PATH}/${adventureId}/status`,
            { status }
        );

        return data.data;
    },

    assignToClass: async (payload: AssignAdventureToClassDto) => {
        const { data } = await axiosInstance.post<ApiResponse<unknown>>(
            `/Adventure/classes/${payload.classId}/assign-adventure`,
            {
                adventureId: payload.adventureId,
                classId: payload.classId,
                startDate: payload.startDate,
            }
        );

        return data;
    },

    delete: async (adventureId: string) => {
        const { data } = await axiosInstance.delete<ApiResponse<void>>(`${BASE_PATH}/${adventureId}`);
        return data;
    },

    getSupervisorAdventureClasses: async (weeklyAdventureId: string): Promise<SupervisorAdventureClass[]> => {
        const { data } = await axiosInstance.get<ApiResponse<SupervisorAdventureClass[]> | SupervisorAdventureClass[]>(
            `/Adventure/${weeklyAdventureId}/classes`
        );

        return normalizeClassListResponse(data);
    },

    getSupervisorAdventureClassChildren: async (weeklyAdventureId: string, classId: string): Promise<SupervisorAdventureChild[]> => {
        const { data } = await axiosInstance.get<ApiResponse<SupervisorAdventureChild[]> | SupervisorAdventureChild[]>(
            `/supervisor/adventures/${weeklyAdventureId}/classes/${classId}/children`
        );

        return normalizePaginatedResponse<SupervisorAdventureChild>(data);
    },

    getSupervisorChildHistory: async (weeklyAdventureId: string, childId: string): Promise<SupervisorChildHistory | null> => {
        const { data } = await axiosInstance.get<ApiResponse<SupervisorChildHistory> | { data: SupervisorChildHistory }>(
            `/supervisor/adventures/${weeklyAdventureId}/children/${childId}/history`
        );

        if (!data) return null;

        // API wraps the payload under `data` object
        const record = (data as any).data ?? data;

        return record as SupervisorChildHistory;
    },

    getSupervisorAdventureTasks: async (
        weeklyAdventureId: string,
        status?: SupervisorAdventureTask['status']
    ): Promise<SupervisorAdventureTask[]> => {
        const { data } = await axiosInstance.get<ApiResponse<PaginatedResponse<SupervisorAdventureTask>> | PaginatedResponse<SupervisorAdventureTask> | SupervisorAdventureTask[]>(
            `/supervisor/adventures/${weeklyAdventureId}/tasks`,
            {
                params: {
                    Status: status || undefined,
                },
            }
        );

        return normalizePaginatedResponse<SupervisorAdventureTask>(data).map((task) => ({
            childAdventureTaskId: task.childAdventureTaskId,
            childId: task.childId,
            childName: task.childName,
            childAvatarUrl: task.childAvatarUrl,
            dayNumber: task.dayNumber,
            taskTitleEn: task.taskTitleEn,
            taskTitleAr: task.taskTitleAr,
            evidenceUrl: task.evidenceUrl,
            status: task.status,
            submittedAt: task.submittedAt,
            isApproved: task.isApproved,
            reviewedBy: task.reviewedBy,
            reviewedAt: task.reviewedAt,
        }));
    },

    reviewSupervisorTask: async (childAdventureTaskId: string, payload: SupervisorTaskReviewDto) => {
        const { data } = await axiosInstance.put<ApiResponse<unknown>>(
            `/supervisor/tasks/${childAdventureTaskId}/review`,
            payload
        );

        return data;
    },
};