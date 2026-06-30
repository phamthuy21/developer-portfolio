'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ExperienceForm } from '@/features/admin/experiences/components/ExperienceForm';
import { useExperience } from '@/features/admin/experiences/api/experience.queries';
import { useParams } from 'next/navigation';

export default function EditExperiencePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: experience, isLoading } = useExperience(id);

  if (isLoading) {
    return <PageContainer>Loading experience data...</PageContainer>;
  }

  if (!experience) {
    return <PageContainer>Experience not found.</PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Edit Experience" 
        description={`Editing: ${experience.title} at ${experience.company}`}
      />
      <ExperienceForm initialData={experience} />
    </PageContainer>
  );
}
