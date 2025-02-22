import { SelectCounseleeRes } from '@/api/api';
import { CounseleeTable } from './table/CounseleeTable';
import { AddCounseleeFormData } from './dialog/CounseleeDialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
  onEdit: (counselee: SelectCounseleeRes) => void;
  onPageChange: (newPage: number) => void;
  page: number;
  size: number;
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
  onEdit,
  onPageChange,
}: CounseleeTableSectionProps) => {
  return (
    <div className="w-full">
      <CounseleeTable data={data ?? []} onDelete={onDelete} onEdit={onEdit} />
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(pagination.currentPage - 1)}
                className={
                  !pagination.hasPrevious
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
            {Array.from({ length: Math.max(1, pagination.totalPages) }).map(
              (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => onPageChange(i)}
                    isActive={pagination.currentPage === i}
                    className="rounded-full w-[30px] h-[30px] font-light flex items-center justify-center"
                    size="md">
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(pagination.currentPage + 1)}
                className={
                  !pagination.hasNext ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
