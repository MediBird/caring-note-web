import { SelectCounseleeRes } from '@/api/api';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useState } from 'react';
import {
  AddCounseleeFormData,
  CounseleeDialog,
} from './dialog/CounseleeDialog';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface CounseleeTableSectionProps {
  data?: SelectCounseleeRes[];
  pagination?: PaginationInfo;
  onDelete: (id: string) => void;
  onUpdate: (counselee: AddCounseleeFormData) => void;
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
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            {pagination.currentPage >= 10 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(pagination.currentPage - 10)}
                />
              </PaginationItem>
            )}
            {Array.from({ length: Math.min(10, pagination.totalPages) }).map(
              (_, i) => {
                const pageGroup = Math.floor(pagination.currentPage / 10);
                const pageNumber = pageGroup * 10 + i;

                if (pageNumber >= pagination.totalPages) return null;

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => onPageChange(pageNumber)}
                      isActive={pagination.currentPage === pageNumber}
                      className="w-[30px] h-[30px] font-light flex items-center justify-center"
                      size="md">
                      {pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              },
            )}
            {pagination.currentPage < pagination.totalPages - 10 && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(pagination.currentPage + 10)}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
