/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { levelService } from '../services/levelService';
import { CreateLevelDto, UpdateLevelDto } from '../types/level';

const QUERY_KEY = 'Levels';

export const useLevels = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => levelService.getAll(),
  });
};

export const useLevel = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => levelService.getById(id),
    enabled: !!id,
  });
};

export const useCreateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLevelDto) => levelService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Level created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create level');
    },
  });
};

export const useUpdateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLevelDto }) =>
      levelService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Level updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update level');
    },
  });
};

export const useDeleteLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => levelService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Level deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete level');
    },
  });
};
