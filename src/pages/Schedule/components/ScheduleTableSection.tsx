import { SelectCounselSessionListItem } from '@/api/api';
import {
  DataTablePagination,
  PaginationInfo,
} from '@/components/common/DataTable/pagination';
import { useCallback } from 'react';
import { useSearchCounselSessions } from '../hooks/query/useCounselSessionQuery';
import {
  useCounselSessionDetailStore,
  useCounselSessionParamsStore,
} from '../hooks/store/useCounselSessionStore';
import { ScheduleTable } from './table/ScheduleTable';

// API 응답 타입 확장
interface ApiResponse {
  content: SelectCounselSessionListItem[];
  pagination?: PaginationInfo;
}

export function ScheduleTableSection() {
  // Zustand 스토어 사용
  const { params, setParams } = useCounselSessionParamsStore();
  const { setDetail } = useCounselSessionDetailStore();

  // 데이터 조회
  const { data, isLoading } = useSearchCounselSessions(
    params.page || 0,
    params.size || 10,
    params.counseleeNameKeyword,
    params.counselorNames,
    params.scheduledDates,
    true,
  );

  // API 응답 데이터를 적절한 형태로 변환
  const sessionData = (data as unknown as ApiResponse)?.content || [];

  // 페이지네이션 정보 구성
  const pagination: PaginationInfo = {
    currentPage: params.page || 0,
    totalPages: (data as unknown as ApiResponse)?.pagination?.totalPages || 1,
    hasPrevious:
      (data as unknown as ApiResponse)?.pagination?.hasPrevious || false,
    hasNext: (data as unknown as ApiResponse)?.pagination?.hasNext || false,
  };

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      setParams({ page });
    },
    [setParams],
  );

  // 삭제 핸들러
  const handleDelete = useCallback((id: string) => {
    // TODO: 삭제 로직 구현
    console.log('삭제할 ID:', id);
  }, []);

  // 수정 핸들러 - 수정 모드 대화상자 열기
  const handleUpdate = useCallback(
    (session: SelectCounselSessionListItem) => {
      setDetail(session);
    },
    [setDetail],
  );

  if (isLoading) {
    return <div className="flex justify-center py-10">데이터 로딩 중...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ScheduleTable
        data={sessionData}
        onDelete={handleDelete}
        onEdit={handleUpdate}
      />
      <DataTablePagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
