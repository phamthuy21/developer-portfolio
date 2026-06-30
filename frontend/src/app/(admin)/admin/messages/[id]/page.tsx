'use client';

import { MessageDetail } from '@/features/admin/messages/components/MessageDetail';
import { useParams } from 'next/navigation';

export default function ViewMessagePage() {
  const params = useParams();
  const id = params.id as string;

  return <MessageDetail id={id} />;
}
