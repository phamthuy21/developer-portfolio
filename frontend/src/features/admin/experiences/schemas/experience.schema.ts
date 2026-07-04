import { z } from 'zod';

export const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().nullable().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean(),
  description: z.string().min(1, 'Description is required'),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;
