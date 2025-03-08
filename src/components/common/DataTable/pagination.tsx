import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface DataTablePaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  pagination,
  onPageChange,
}: DataTablePaginationProps) {
  return (
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
                className="w-[30px] h-[30px] font-light flex items-center justify-center"
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
  );
}
