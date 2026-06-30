import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experiencesApi } from './experience.api';
import { QUERY_KEYS } from '@/lib/react-query/query-keys';
import { ExperienceFormData } from '../schemas/experience.schema';

export const useExperiences = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_EXPERIENCES, params],
    queryFn: () => experiencesApi.list(params),
  });
};

export const useExperience = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_EXPERIENCES, id],
    queryFn: () => experiencesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExperienceFormData) => experiencesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_EXPERIENCES] });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExperienceFormData> }) => experiencesApi.update({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_EXPERIENCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_EXPERIENCES, variables.id] });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experiencesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_EXPERIENCES] });
    },
  });
};

export const useExperienceActions = () => {
  const queryClient = useQueryClient();
  const invalidate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_EXPERIENCES] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_EXPERIENCES, id] });
  };

  const restoreMutation = useMutation({
    mutationFn: (id: string) => experiencesApi.restore(id),
    onSuccess: (_, id) => invalidate(id),
  });

  return {
    restore: restoreMutation,
  };
};
