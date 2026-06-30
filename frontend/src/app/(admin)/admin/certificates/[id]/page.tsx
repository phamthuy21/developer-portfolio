'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { CertificateForm } from '@/features/admin/certificates/components/CertificateForm';
import { useCertificate } from '@/features/admin/certificates/api/certificate.queries';
import { useParams } from 'next/navigation';

export default function EditCertificatePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: certificate, isLoading } = useCertificate(id);

  if (isLoading) {
    return <PageContainer>Loading certificate data...</PageContainer>;
  }

  if (!certificate) {
    return <PageContainer>Certificate not found.</PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Edit Certificate" 
        description={`Editing: ${certificate.name}`}
      />
      <CertificateForm initialData={certificate} />
    </PageContainer>
  );
}
