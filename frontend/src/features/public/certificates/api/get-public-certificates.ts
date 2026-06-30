import { apiClient } from '@/lib/api/client';
import { Certificate } from '@/features/admin/certificates/types';

export const getPublicCertificates = async () => {
  const { data } = await apiClient.get<Certificate[]>('/certificates');
  return data;
};
