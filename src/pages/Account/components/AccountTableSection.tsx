import {
  DataTablePagination,
  PaginationInfo,
} from '@/components/common/DataTable/pagination';
import { useCallback, useState } from 'react';
import { useGetCounselorsByPage } from '../hooks/queries/useCounselorQuery';
import { CounselorFetchParams } from '../hooks/store/useCounselorStore';
import { AccountTable } from './table/AccountTable';

export function AccountTableSection() {
  // 상담사 목록 조회 파라미터 상태 관리
  const [params, setParams] = useState<CounselorFetchParams>({
    page: 0,
    size: 10,
  });

  // useGetCounselorsByPage 훅을 사용하여 상담사 목록 데이터 조회
  const { data, isLoading } = useGetCounselorsByPage(params);

  // API 응답 데이터를 적절한 형태로 변환
  const counselorData = data?.content || [];

  const pagination: PaginationInfo = {
    currentPage: params.page ?? 0,
    totalPages: data?.totalPages || 1,
    hasPrevious: data?.hasPrevious || false,
    hasNext: data?.hasNext || false,
  };

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      setParams({ ...params, page });
    },
    [params, setParams],
  );

  const handleSizeChange = useCallback(
    (size: number) => {
      setParams({ ...params, size });
    },
    [params, setParams],
  );

  if (isLoading) {
    return <div className="flex justify-center py-10">데이터 로딩 중...</div>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <AccountTable data={counselorData} />
      <DataTablePagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        currentSize={params.size || 10}
      />
    </div>
  );
}
