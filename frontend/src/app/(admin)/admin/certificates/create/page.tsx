'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { CertificateForm } from '@/features/admin/certificates/components/CertificateForm';

export default function CreateCertificatePage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Add Certificate" 
        description="Add a new certificate to your portfolio."
      />
      <CertificateForm />
    </PageContainer>
  );
}
