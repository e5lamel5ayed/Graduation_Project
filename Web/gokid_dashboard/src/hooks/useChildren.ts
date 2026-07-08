/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { childrenService } from '@/src/services/childrenService';
import { ChildQueryParams, Child, ChildsListResponse, EnrollChildDto, DeleteChildDto } from '@/src/types/children';
import { toast } from 'sonner';

const QUERY_KEY = 'children';
const CLASS_QUERY_KEY = 'Class';

export function useChildren(params: ChildQueryParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: async () => {
      const response = await childrenService.getAll(params);
      return response;
    },
    staleTime: 0, // Always refetch after invalidation
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useChild(childId: string) {
  return useQuery({
    queryKey: [QUERY_KEY, childId],
    queryFn: () => childrenService.getById(childId),
    enabled: !!childId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useEnrollChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnrollChildDto) => childrenService.enrollChild(data),
    onSuccess: () => {
      // Invalidate children list so the new student appears immediately
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      // Also invalidate Class query so the student count on class cards updates
      queryClient.invalidateQueries({ queryKey: [CLASS_QUERY_KEY] });
      toast.success('تم إضافة الطفل بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة الطفل');
    },
  });
}

export function useEnrollChildToClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnrollChildDto) => childrenService.enrollChildToClass(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CLASS_QUERY_KEY] });
      toast.success('تم تسجيل الطفل في الفصل بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الطفل');
    },
  });
}

export function useDeleteChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteChildDto) => childrenService.deleteChild(data),
    onSuccess: () => {
      // Invalidate both children and Class queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CLASS_QUERY_KEY] });
      toast.success('تم حذف الطفل بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف الطفل');
    },
  });
}

export function useDeleteChildFromInstitution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (childId: string) => childrenService.deleteChildFromInstitution(childId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CLASS_QUERY_KEY] });
      toast.success('تم حذف الطفل بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف الطفل');
    },
  });
}
