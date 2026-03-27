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
    ApiResponse,
} from '../types/adventure';

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
        description: adventure.description ?? adventure.descriptionEn ?? adventure.descriptionAr ?? '',
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

    create: async (adventureData: CreateAdventureDto) => {
        const formData = toFormData({
            Title: adventureData.title,
            Description: adventureData.description,
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
            Description: adventureData.description,
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
};
