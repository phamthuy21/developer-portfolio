import { z } from 'zod';

export const publicContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  content: z.string().min(10, 'Message must be at least 10 characters'),
});

export type PublicContactFormValues = z.infer<typeof publicContactSchema>;
