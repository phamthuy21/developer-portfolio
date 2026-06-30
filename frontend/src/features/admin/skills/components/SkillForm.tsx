'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema, SkillFormData } from '../schemas/skill.schema';
import { useCreateSkill, useUpdateSkill } from '../api/skill.queries';
import { Skill } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

interface SkillFormProps {
  initialData?: Skill;
}

export function SkillForm({ initialData }: SkillFormProps) {
  const router = useRouter();
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();

  const isEditing = !!initialData;

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      category: initialData.category,
      icon: initialData.icon,
      proficiency: initialData.proficiency,
      order: initialData.order,
    } : {
      name: '',
      category: '',
      icon: null,
      proficiency: 0,
      order: 0,
    },
  });

  const onSubmit = async (data: SkillFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
        toast.success('Skill updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Skill created successfully');
      }
      router.push(ROUTES.ADMIN.SKILLS);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to save skill');
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register('name')} />
          {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...form.register('category')} />
          {form.formState.errors.category && <p className="text-red-500 text-xs">{form.formState.errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon (URL or Class)</Label>
          <Input id="icon" {...form.register('icon')} />
          {form.formState.errors.icon && <p className="text-red-500 text-xs">{form.formState.errors.icon.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency (0-100)</Label>
            <Input id="proficiency" type="number" {...form.register('proficiency', { valueAsNumber: true })} />
            {form.formState.errors.proficiency && <p className="text-red-500 text-xs">{form.formState.errors.proficiency.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} />
            {form.formState.errors.order && <p className="text-red-500 text-xs">{form.formState.errors.order.message}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Skill'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
