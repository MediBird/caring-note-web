import { SelectCounseleeRes } from '@/api';
import {
  DataTablePagination,
  PaginationInfo,
} from '@/components/common/DataTable/pagination';
import { useState } from 'react';
import {
  AddCounseleeFormData,
  CounseleeDialog,
} from './dialog/CounseleeDialog';
import { CounseleeTable } from './table/CounseleeTable';

interface CounseleeTableSectionProps {
  data?: SelectCounseleeRes[];
  pagination?: PaginationInfo;
  onDelete: (id: string) => void;
  onUpdate: (counselee: AddCounseleeFormData) => void;
  onPageChange: (newPage: number) => void;
}

export const CounseleeTableSection = ({
  data,
  pagination = {
    currentPage: 0,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  },
  onDelete,
  onUpdate,
  onPageChange,
}: CounseleeTableSectionProps) => {
  const [editingCounselee, setEditingCounselee] =
    useState<SelectCounseleeRes | null>(null);

  const handleEdit = (counselee: SelectCounseleeRes) => {
    setEditingCounselee(counselee);
  };

  const handleEditSubmit = (data: AddCounseleeFormData) => {
    onUpdate(data);
    setEditingCounselee(null);
  };

  return (
    <div className="w-full">
      <CounseleeTable
        data={data ?? []}
        onDelete={onDelete}
        onEdit={handleEdit}
      />
      {editingCounselee && (
        <CounseleeDialog
          mode="edit"
          initialData={editingCounselee}
          onSubmit={handleEditSubmit}
          open={!!editingCounselee}
          onOpenChange={(open) => !open && setEditingCounselee(null)}
        />
      )}
      <div className="mt-4 flex justify-center">
        <DataTablePagination
          pagination={pagination}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
