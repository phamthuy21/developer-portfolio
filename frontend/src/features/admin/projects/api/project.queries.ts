import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from './project.api';
import { QUERY_KEYS } from '@/lib/react-query/query-keys';
import { ProjectFormData } from '../schemas/project.schema';

export const useProjects = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECTS, params],
    queryFn: () => projectsApi.list(params),
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECTS, id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectFormData) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECTS] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectFormData> }) => projectsApi.update({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECTS, variables.id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECTS] });
    },
  });
};

export const useProjectActions = () => {
  const queryClient = useQueryClient();
  const invalidate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECTS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECTS, id] });
  };

  const publishMutation = useMutation({
    mutationFn: (id: string) => projectsApi.publish(id),
    onSuccess: (_, id) => invalidate(id),
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => projectsApi.unpublish(id),
    onSuccess: (_, id) => invalidate(id),
  });

  const featureMutation = useMutation({
    mutationFn: (id: string) => projectsApi.feature(id),
    onSuccess: (_, id) => invalidate(id),
  });

  const unfeatureMutation = useMutation({
    mutationFn: (id: string) => projectsApi.unfeature(id),
    onSuccess: (_, id) => invalidate(id),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => projectsApi.restore(id),
    onSuccess: (_, id) => invalidate(id),
  });

  return {
    publish: publishMutation,
    unpublish: unpublishMutation,
    feature: featureMutation,
    unfeature: unfeatureMutation,
    restore: restoreMutation,
  };
};
