'use client';

import React, { useState } from 'react';
import { useMessages, useMessageActions, useDeleteMessage } from '../api/message.queries';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Message } from '../types';
import Link from 'next/link';
import { Eye, Trash2, Check, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export function MessageList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useMessages({ page, limit: 10, search });
  const { updateStatus, restore } = useMessageActions();
  const deleteMutation = useDeleteMessage();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete message');
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'subject', label: 'Subject' },
    { key: 'createdAt', label: 'Date', render: (m: Message) => new Date(m.createdAt).toLocaleDateString() },
    { 
      key: 'status', 
      label: 'Status', 
      render: (m: Message) => (
        <div className="flex gap-2">
          {!m.isRead && <StatusBadge status="Unread" type="info" />}
          {m.isRead && <StatusBadge status="Read" type="default" />}
          {m.deletedAt && <StatusBadge status="Deleted" type="danger" />}
        </div>
      ) 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (m: Message) => (
        <div className="flex items-center space-x-2">
          <Link href={`${ROUTES.ADMIN.MESSAGES}/${m.id}`}>
            <Button variant="ghost" size="sm" title="View"><Eye className="w-4 h-4" /></Button>
          </Link>
          {!m.isRead ? (
            <Button variant="ghost" size="sm" onClick={() => updateStatus.mutate({ id: m.id, isRead: true })} title="Mark as Read">
              <Check className="w-4 h-4 text-green-500" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => updateStatus.mutate({ id: m.id, isRead: false })} title="Mark as Unread">
              <X className="w-4 h-4 text-neutral-500" />
            </Button>
          )}
          {m.deletedAt ? (
            <Button variant="ghost" size="sm" onClick={() => restore.mutate(m.id)} title="Restore">Restore</Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(m.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput className="w-64" placeholder="Search messages..." onSearch={setSearch} />
      </div>

      <DataTable data={data?.data || []} columns={columns} isLoading={isLoading} />
      
      {data?.meta && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
          hasNextPage={data.meta.page < data.meta.totalPages}
          hasPreviousPage={data.meta.page > 1}
        />
      )}

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
