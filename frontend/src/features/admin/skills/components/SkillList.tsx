'use client';

import React, { useState } from 'react';
import { useSkills, useSkillActions, useDeleteSkill } from '../api/skill.queries';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Skill } from '../types';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export function SkillList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useSkills({ page, limit: 10, search });
  const { restore } = useSkillActions();
  const deleteMutation = useDeleteSkill();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Skill deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete skill');
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'proficiency', label: 'Proficiency' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (s: Skill) => (
        <div className="flex gap-2">
          {s.deletedAt && <StatusBadge status="Deleted" type="danger" />}
        </div>
      ) 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (s: Skill) => (
        <div className="flex items-center space-x-2">
          <Link href={`${ROUTES.ADMIN.SKILLS}/${s.id}`}>
            <Button variant="ghost" size="sm" title="Edit"><Edit className="w-4 h-4" /></Button>
          </Link>
          {s.deletedAt ? (
            <Button variant="ghost" size="sm" onClick={() => restore.mutate(s.id)} title="Restore">Restore</Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(s.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput className="w-64" placeholder="Search skills..." onSearch={setSearch} />
        <Link href={`${ROUTES.ADMIN.SKILLS}/create`}>
          <Button>Add Skill</Button>
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
