import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogsApi } from './blog.api';
import { QUERY_KEYS } from '@/lib/react-query/query-keys';
import { BlogFormData } from '../schemas/blog.schema';

export const useBlogs = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_BLOGS, params],
    queryFn: () => blogsApi.list(params),
  });
};

export const useBlog = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_BLOGS, id],
    queryFn: () => blogsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BlogFormData) => blogsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogFormData> }) => blogsApi.update({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS, variables.id] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS] });
    },
  });
};

export const useBlogActions = () => {
  const queryClient = useQueryClient();
  const invalidate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BLOGS, id] });
  };

  const publishMutation = useMutation({
    mutationFn: (id: string) => blogsApi.publish(id),
    onSuccess: (_, id) => invalidate(id),
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => blogsApi.unpublish(id),
    onSuccess: (_, id) => invalidate(id),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => blogsApi.restore(id),
    onSuccess: (_, id) => invalidate(id),
  });

  return {
    publish: publishMutation,
    unpublish: unpublishMutation,
    restore: restoreMutation,
  };
};
