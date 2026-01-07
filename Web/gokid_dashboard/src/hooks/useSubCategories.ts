/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subCategoryService } from '../services/subCategoryService';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category';

const QUERY_KEY = 'TaskSubCategory';

export const useSubCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => subCategoryService.getAll(),
  });
};

export const useSubCategory = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => subCategoryService.getById(id),
    enabled: !!id,
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => subCategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('تم إضافة الفئة الفرعية بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة الفئة الفرعية');
    },
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      subCategoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('تم تحديث الفئة الفرعية بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث الفئة الفرعية');
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subCategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('تم حذف الفئة الفرعية بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف الفئة الفرعية');
    },
  });
};
