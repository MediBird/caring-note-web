import { SelectCounselSessionRes } from '@/api';
import {
  DataTablePagination,
  PaginationInfo,
} from '@/components/common/DataTable/pagination';
import { useHighlightedSession } from '@/hooks/useCounselSessionQuery';
import { useCallback } from 'react';
import {
  useDeleteCounselSession,
  useSearchCounselSessions,
} from '../hooks/query/useCounselSessionQuery';
import { useCounselSessionParamsStore } from '../hooks/store/useCounselSessionStore';
import { CounselSessionTable } from './table/CounselSessionTable';

// API 응답 타입 확장
interface ApiResponse {
  content: SelectCounselSessionRes[];
  pagination?: PaginationInfo;
}

export function CounselSessionTableSection() {
  const { params, setParams } = useCounselSessionParamsStore();

  const { mutate: deleteCounselSession } = useDeleteCounselSession();
  const { data: highlightedSession } = useHighlightedSession();

  const { data, isLoading } = useSearchCounselSessions(
    params.page || 0,
    params.size || 25,
    params.counseleeNameKeyword,
    params.counselorNames,
    params.scheduledDates,
  );

  // API 응답 데이터를 적절한 형태로 변환
  const sessionData = (data as unknown as ApiResponse)?.content || [];

  const pagination: PaginationInfo = {
    currentPage: params.page || 0,
    totalPages: data?.pageInfo?.totalPages || 1,
    hasPrevious: data?.pageInfo?.hasPrevious || false,
    hasNext: data?.pageInfo?.hasNext || false,
  };

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      setParams({ page });
    },
    [setParams],
  );

  // 삭제 핸들러
  const handleDelete = (id: string) => {
    deleteCounselSession({ counselSessionId: id });
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">데이터 로딩 중...</div>;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <CounselSessionTable
        data={sessionData}
        onDelete={handleDelete}
        highlightedSession={highlightedSession}
      />
      <DataTablePagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
