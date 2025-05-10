import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface DataTablePaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  currentSize: number;
  pageSizeOptions?: number[];
}

export function DataTablePagination({
  pagination,
  onPageChange,
  onSizeChange,
  currentSize,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTablePaginationProps) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute left-4 flex items-center space-x-2">
        <p className="text-sm font-medium">페이지 당 표시 개수</p>
        <Select
          value={`${currentSize}`}
          onValueChange={(value) => {
            onSizeChange(Number(value));
          }}>
          <SelectTrigger className="border-grayscale-10x h-[30px] w-[70px]">
            <SelectValue placeholder={`${currentSize}`} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Pagination>
        <PaginationContent>
          {pagination.currentPage >= 10 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(pagination.currentPage - 10)}
              />
            </PaginationItem>
          )}
          {Array.from({
            length: Math.min(10, pagination.totalPages),
          }).map((_, i) => {
            const pageGroup = Math.floor(pagination.currentPage / 10);
            const pageNumber = pageGroup * 10 + i;

            if (pageNumber >= pagination.totalPages) return null;

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => onPageChange(pageNumber)}
                  isActive={pagination.currentPage === pageNumber}
                  className="flex h-[30px] w-[30px] items-center justify-center font-light"
                  size="md">
                  {pageNumber + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}
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
  );
}
