/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { giftService } from '../services/giftService';
import { CreateGiftDto, UpdateGiftDto } from '../types/gift';

const QUERY_KEY = 'Gift';

export const useGifts = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => giftService.getAll(),
  });
};

export const useGift = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => giftService.getById(id),
    enabled: !!id,
  });
};

export const useCreateGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGiftDto) => giftService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Gift added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add gift');
    },
  });
};

export const useUpdateGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGiftDto }) =>
      giftService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Gift updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update gift');
    },
  });
};

export const useDeleteGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => giftService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Gift deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete gift');
    },
  });
};
