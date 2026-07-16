import { apiClient } from '@/lib/api/client';
import { Certificate } from '@/features/admin/certificates/types';
import { mapCertificateResponse } from '@/lib/utils/map-entities';

export const getPublicCertificates = async (): Promise<Certificate[]> => {
  const { data } = await apiClient.get<{ data: unknown[] }>('/certificates');
  
  if (!data || !Array.isArray(data.data)) {
    return [];
  }
  
  return data.data.map(mapCertificateResponse);
};
