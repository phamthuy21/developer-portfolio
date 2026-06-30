'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { DashboardStats } from '@/features/admin/dashboard/components/DashboardStats';

export default function AdminDashboardPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your portfolio content and statistics."
      />
      <DashboardStats />
    </PageContainer>
  );
}
