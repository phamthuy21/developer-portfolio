import { z } from 'zod';

export const certificateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  credentialUrl: z.string().url().nullable().optional().or(z.literal('')),
  thumbnail: z.string().nullable().optional(),
});

export type CertificateFormData = z.infer<typeof certificateSchema>;
