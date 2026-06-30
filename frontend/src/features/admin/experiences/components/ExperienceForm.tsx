'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema, ExperienceFormData } from '../schemas/experience.schema';
import { useCreateExperience, useUpdateExperience } from '../api/experience.queries';
import { Experience } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

interface ExperienceFormProps {
  initialData?: Experience;
}

export function ExperienceForm({ initialData }: ExperienceFormProps) {
  const router = useRouter();
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();

  const isEditing = !!initialData;

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      company: initialData.company,
      location: initialData.location,
      startDate: initialData.startDate,
      endDate: initialData.endDate,
      isCurrent: initialData.isCurrent,
      description: initialData.description,
      order: initialData.order,
    } : {
      title: '',
      company: '',
      location: null,
      startDate: '',
      endDate: null,
      isCurrent: false,
      description: '',
      order: 0,
    },
  });

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
        toast.success('Experience updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Experience created successfully');
      }
      router.push(ROUTES.ADMIN.EXPERIENCES);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to save experience');
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...form.register('company')} />
            {form.formState.errors.company && <p className="text-red-500 text-xs">{form.formState.errors.company.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...form.register('location')} />
          {form.formState.errors.location && <p className="text-red-500 text-xs">{form.formState.errors.location.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" {...form.register('startDate')} />
            {form.formState.errors.startDate && <p className="text-red-500 text-xs">{form.formState.errors.startDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" {...form.register('endDate')} disabled={form.watch('isCurrent')} />
            {form.formState.errors.endDate && <p className="text-red-500 text-xs">{form.formState.errors.endDate.message}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isCurrent"
            checked={form.watch('isCurrent')}
            onCheckedChange={(checked) => {
              form.setValue('isCurrent', checked as boolean);
              if (checked) form.setValue('endDate', null);
            }}
          />
          <Label htmlFor="isCurrent">I currently work here</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Markdown)</Label>
          <textarea
            id="description"
            {...form.register('description')}
            className="w-full min-h-[150px] p-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent"
          />
          {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} />
            {form.formState.errors.order && <p className="text-red-500 text-xs">{form.formState.errors.order.message}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Experience'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
