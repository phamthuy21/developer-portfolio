'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { MessageList } from '@/features/admin/messages/components/MessageList';

export default function AdminMessagesPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Messages" 
        description="View and manage messages from your portfolio contact form."
      />
      <MessageList />
    </PageContainer>
  );
}
