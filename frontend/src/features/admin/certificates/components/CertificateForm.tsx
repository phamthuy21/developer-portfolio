'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificateSchema, CertificateFormData } from '../schemas/certificate.schema';
import { useCreateCertificate, useUpdateCertificate } from '../api/certificate.queries';
import { Certificate } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

interface CertificateFormProps {
  initialData?: Certificate;
}

export function CertificateForm({ initialData }: CertificateFormProps) {
  const router = useRouter();
  const createMutation = useCreateCertificate();
  const updateMutation = useUpdateCertificate();

  const isEditing = !!initialData;

  const form = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      issuer: initialData.issuer,
      issueDate: initialData.issueDate,
      credentialUrl: initialData.credentialUrl,
      credentialId: initialData.credentialId,
      thumbnail: initialData.thumbnail,
      order: initialData.order,
    } : {
      name: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
      credentialId: '',
      thumbnail: null,
      order: 0,
    },
  });

  const onSubmit = async (data: CertificateFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
        toast.success('Certificate updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Certificate created successfully');
      }
      router.push(ROUTES.ADMIN.CERTIFICATES);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to save certificate');
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Certificate Name</Label>
          <Input id="name" {...form.register('name')} />
          {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="issuer">Issuer</Label>
          <Input id="issuer" {...form.register('issuer')} />
          {form.formState.errors.issuer && <p className="text-red-500 text-xs">{form.formState.errors.issuer.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input id="issueDate" type="date" {...form.register('issueDate')} />
          {form.formState.errors.issueDate && <p className="text-red-500 text-xs">{form.formState.errors.issueDate.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="credentialId">Credential ID</Label>
            <Input id="credentialId" {...form.register('credentialId')} />
            {form.formState.errors.credentialId && <p className="text-red-500 text-xs">{form.formState.errors.credentialId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentialUrl">Credential URL</Label>
            <Input id="credentialUrl" {...form.register('credentialUrl')} />
            {form.formState.errors.credentialUrl && <p className="text-red-500 text-xs">{form.formState.errors.credentialUrl.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} />
            {form.formState.errors.order && <p className="text-red-500 text-xs">{form.formState.errors.order.message}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Certificate'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
