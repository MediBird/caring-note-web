import { DataTable } from '@/components/common/DataTable/data-table';
import { createCounseleeColumns } from './counseleeColumns';
import { useCounseleeStore } from '../../hooks/store/useCounseleeStore';
import { useSelectCounseleeList } from '../../hooks/query/useCounseleeQuery';
import { useEffect } from 'react';
import {
  DataTablePagination,
  PaginationInfo,
} from '@/components/common/DataTable/pagination';

export function CounseleeTable() {
  const {
    filters,
    pagination,
    counselees,
    setLoading,
    setError,
    setCounselees,
    setPage,
    setSize,
  } = useCounseleeStore();

  const {
    data,
    isLoading: queryIsLoading,
    error,
  } = useSelectCounseleeList({
    page: pagination.page,
    size: pagination.size,
    name: filters.name,
    birthDates: filters.birthDates,
    affiliatedWelfareInstitutions: filters.affiliatedWelfareInstitutions,
  });

  useEffect(() => {
    setLoading(queryIsLoading);
  }, [queryIsLoading, setLoading]);

  useEffect(() => {
    if (error) {
      setError(error.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }, [error, setError]);

  useEffect(() => {
    if (data) {
      setCounselees(data);
    }
  }, [data, setCounselees]);

  const handlePageChangeForPaginationComponent = (pageIndex: number) => {
    setPage(pageIndex);
  };

  const handlePageSizeChangeForPaginationComponent = (newPageSize: number) => {
    setSize(newPageSize);
  };

  const paginationInfoForComponent: PaginationInfo = {
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
    hasPrevious: pagination.page > 0,
    hasNext: pagination.page < pagination.totalPages - 1,
  };

  if (queryIsLoading) {
    // TODO: 적절한 로딩 인디케이터 UI 추가
    // return <p>로딩 중...</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-5">
      <DataTable
        columns={createCounseleeColumns()}
        data={counselees}
        minWidth={600}
      />
      <DataTablePagination
        pagination={paginationInfoForComponent}
        onPageChange={handlePageChangeForPaginationComponent}
        onSizeChange={handlePageSizeChangeForPaginationComponent}
        currentSize={pagination.size}
      />
    </div>
  );
}
