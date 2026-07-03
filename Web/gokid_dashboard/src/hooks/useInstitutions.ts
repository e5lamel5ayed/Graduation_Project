/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { institutionService } from '../services/institutionService';
import {
  CreateInstitutionDto,
  InstitutionQueryParams,
  UpdateInstitutionDto,
} from '../types/institution';

const QUERY_KEY = 'Institutions';

export const useInstitutions = (params: InstitutionQueryParams = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'list', params],
    queryFn: () => institutionService.getAll(params),
  });
};

export const useInstitution = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => institutionService.getById(id),
    enabled: !!id,
  });
};

export const useInstitutionSupervisorProfile = (
  institutionId: string,
  supervisorId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'supervisor', institutionId, supervisorId],
    queryFn: () => institutionService.getSupervisorProfile(institutionId, supervisorId),
    enabled: enabled && !!institutionId && !!supervisorId,
  });
};

export const useCreateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInstitutionDto) => institutionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Institution created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create institution');
    },
  });
};

export const useUpdateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInstitutionDto }) =>
      institutionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Institution updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update institution');
    },
  });
};

export const useDeleteInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => institutionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Institution deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete institution');
    },
  });
};