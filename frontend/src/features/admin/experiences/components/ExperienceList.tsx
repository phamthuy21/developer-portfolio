'use client';

import React, { useState } from 'react';
import { useExperiences, useExperienceActions, useDeleteExperience } from '../api/experience.queries';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Experience } from '../types';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export function ExperienceList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useExperiences({ page, limit: 10, search });
  const { restore } = useExperienceActions();
  const deleteMutation = useDeleteExperience();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Experience deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete experience');
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'company', label: 'Company' },
    { 
      key: 'dates', 
      label: 'Dates', 
      render: (e: Experience) => (
        <span>{e.startDate} - {e.isCurrent ? 'Present' : e.endDate}</span>
      ) 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (e: Experience) => (
        <div className="flex gap-2">
          {e.deletedAt && <StatusBadge status="Deleted" type="danger" />}
        </div>
      ) 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (e: Experience) => (
        <div className="flex items-center space-x-2">
          <Link href={`${ROUTES.ADMIN.EXPERIENCES}/${e.id}`}>
            <Button variant="ghost" size="sm" title="Edit"><Edit className="w-4 h-4" /></Button>
          </Link>
          {e.deletedAt ? (
            <Button variant="ghost" size="sm" onClick={() => restore.mutate(e.id)} title="Restore">Restore</Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(e.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput className="w-64" placeholder="Search experiences..." onSearch={setSearch} />
        <Link href={`${ROUTES.ADMIN.EXPERIENCES}/create`}>
          <Button>Add Experience</Button>
        </Link>
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
