import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificatesApi } from './certificate.api';
import { QUERY_KEYS } from '@/lib/react-query/query-keys';
import { CertificateFormData } from '../schemas/certificate.schema';

export const useCertificates = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_CERTIFICATES, params],
    queryFn: () => certificatesApi.list(params),
  });
};

export const useCertificate = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_CERTIFICATES, id],
    queryFn: () => certificatesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CertificateFormData) => certificatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_CERTIFICATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS] });
    },
  });
};

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CertificateFormData> }) => certificatesApi.update({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_CERTIFICATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_CERTIFICATES, variables.id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS] });
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => certificatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_CERTIFICATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS] });
    },
  });
};

export const useCertificateActions = () => {
  const queryClient = useQueryClient();
  const invalidate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_CERTIFICATES] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_CERTIFICATES, id] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DASHBOARD_STATS] });
  };

  const restoreMutation = useMutation({
    mutationFn: (id: string) => certificatesApi.restore(id),
    onSuccess: (_, id) => invalidate(id),
  });

  return {
    restore: restoreMutation,
  };
};
