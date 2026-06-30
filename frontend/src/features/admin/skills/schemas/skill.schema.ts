import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  icon: z.string().nullable().optional(),
  proficiency: z.number().min(0).max(100),
  order: z.number().int(),
});

export type SkillFormData = z.infer<typeof skillSchema>;
