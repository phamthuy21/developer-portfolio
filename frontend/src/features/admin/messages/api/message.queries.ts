import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from './message.api';
import { QUERY_KEYS } from '@/lib/react-query/query-keys';

export const useMessages = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_MESSAGES, params],
    queryFn: () => messagesApi.list(params),
  });
};

export const useMessage = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_MESSAGES, id],
    queryFn: () => messagesApi.getById(id),
    enabled: !!id,
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_MESSAGES] });
    },
  });
};

export const useMessageActions = () => {
  const queryClient = useQueryClient();
  const invalidate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_MESSAGES] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_MESSAGES, id] });
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) => messagesApi.updateStatus(id, isRead),
    onSuccess: (_, variables) => invalidate(variables.id),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => messagesApi.restore(id),
    onSuccess: (_, id) => invalidate(id),
  });

  return {
    updateStatus: updateStatusMutation,
    restore: restoreMutation,
  };
};
