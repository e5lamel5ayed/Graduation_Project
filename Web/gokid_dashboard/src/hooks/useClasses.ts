/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { classService } from '../services/classService';
import { AssignSupervisorDto, ClassQueryParams, CreateClassDto, UpdateClassDto } from '../types/class';

const QUERY_KEY = 'Class';

export const useClasses = (params: ClassQueryParams = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY, params.pageNumber || 1, params.pageSize || 8, params.SearchName || ''],
    queryFn: () => classService.getAll(params),
  });
};

export const useClassById = (classId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, classId],
    queryFn: () => classService.getById(classId),
    enabled: !!classId,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassDto) => classService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('تم إضافة الفئة بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة الفئة');
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: UpdateClassDto }) =>
      classService.update(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('تم تحديث الفئة بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث الفئة');
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => classService.delete(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('تم حذف الفئة بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف الفئة');
    },
  });
};

export const useAssignSupervisor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: AssignSupervisorDto }) =>
      classService.assignSupervisor(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('تم تعيين المشرف بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تعيين المشرف');
    },
  });
};

export const useUnassignSupervisor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, supervisorId }: { classId: string; supervisorId: string }) =>
      classService.unassignSupervisor(classId, supervisorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('تم إلغاء تعيين المشرف بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إلغاء تعيين المشرف');
    },
  });
};