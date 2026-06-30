'use client';

import React, { useEffect } from 'react';
import { useMessage, useMessageActions } from '../api/message.queries';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';

interface MessageDetailProps {
  id: string;
}

export function MessageDetail({ id }: MessageDetailProps) {
  const router = useRouter();
  const { data: message, isLoading } = useMessage(id);
  const { updateStatus } = useMessageActions();

  useEffect(() => {
    if (message && !message.isRead) {
      updateStatus.mutate({ id: message.id, isRead: true });
    }
  }, [message, updateStatus]);

  if (isLoading) {
    return <PageContainer>Loading message...</PageContainer>;
  }

  if (!message) {
    return <PageContainer>Message not found.</PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader 
        title={message.subject} 
        description={`From: ${message.name} (${message.email}) on ${new Date(message.createdAt).toLocaleString()}`}
      />
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm mt-6">
        <div className="whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
          {message.content}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={() => router.back()}>Back to Messages</Button>
      </div>
    </PageContainer>
  );
}
