'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { CertificateList } from '@/features/admin/certificates/components/CertificateList';

export default function AdminCertificatesPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Certificates" 
        description="Manage your professional certificates and licenses."
      />
      <CertificateList />
    </PageContainer>
  );
}
