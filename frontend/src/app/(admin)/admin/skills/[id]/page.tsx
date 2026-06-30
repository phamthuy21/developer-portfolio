'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { SkillForm } from '@/features/admin/skills/components/SkillForm';
import { useSkill } from '@/features/admin/skills/api/skill.queries';
import { useParams } from 'next/navigation';

export default function EditSkillPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: skill, isLoading } = useSkill(id);

  if (isLoading) {
    return <PageContainer>Loading skill data...</PageContainer>;
  }

  if (!skill) {
    return <PageContainer>Skill not found.</PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Edit Skill" 
        description={`Editing: ${skill.name}`}
      />
      <SkillForm initialData={skill} />
    </PageContainer>
  );
}
