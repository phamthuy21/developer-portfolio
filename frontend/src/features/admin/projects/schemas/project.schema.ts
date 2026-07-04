import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  thumbnail: z.string().url('Invalid URL').nullable().optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  repositoryUrl: z.string().url().nullable().optional().or(z.literal('')),
  liveUrl: z.string().url().nullable().optional().or(z.literal('')),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
