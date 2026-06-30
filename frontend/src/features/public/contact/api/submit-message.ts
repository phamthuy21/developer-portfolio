import { apiClient } from '@/lib/api/client';
import { PublicContactFormValues } from '../schemas/contact.schema';

export const submitContactMessage = async (data: PublicContactFormValues) => {
  const response = await apiClient.post('/messages', data);
  return response.data;
};
