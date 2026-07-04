import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from './skill.api';
import { QUERY_KEYS } from '@/lib/react-query/query-keys';
import { SkillFormData } from '../schemas/skill.schema';

export const useSkills = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_SKILLS, params],
    queryFn: () => skillsApi.list(params),
  });
};

export const useSkill = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_SKILLS, id],
    queryFn: () => skillsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SkillFormData) => skillsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_SKILLS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS] });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SkillFormData> }) => skillsApi.update({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_SKILLS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_SKILLS, variables.id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => skillsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_SKILLS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS] });
    },
  });
};

export const useSkillActions = () => {
  const queryClient = useQueryClient();
  const invalidate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_SKILLS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_SKILLS, id] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS] });
  };

  const restoreMutation = useMutation({
    mutationFn: (id: string) => skillsApi.restore(id),
    onSuccess: (_, id) => invalidate(id),
  });

  return {
    restore: restoreMutation,
  };
};
