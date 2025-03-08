import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Header } from '../../components/ui/Header';
import { FilterSection } from './components/FilterSection';
import { ScheduleTableSection } from './components/ScheduleTableSection';
import { useCounselSessionParamsStore } from './hooks/store/useCounselSessionStore';

/**
 * 상담 일정 관리 페이지
 *
 * 상담 일정을 조회, 등록, 수정, 삭제할 수 있는 페이지입니다.
 * FilterSection과 ScheduleTableSection 컴포넌트로 구성되어 있으며,
 * 각 컴포넌트는 Zustand 스토어를 통해 상태를 공유합니다.
 */
const ScheduleManagement = () => {
  // Zustand 스토어
  const { params } = useCounselSessionParamsStore();

  // 검색 쿼리 - 명시적인 검색 버튼 클릭 시에만 사용
  const { refetch } = useQuery({
    queryKey: ['counselSessions', params],
    queryFn: async () => {
      // 빈 응답으로 지정 (실제 데이터는 ScheduleTableSection에서 로드함)
      return null;
    },
    enabled: false, // 수동 실행 모드
  });

  // 검색 버튼 핸들러 - 검증 없이 항상 refetch 요청
  // (실제 API 호출 여부는 useSearchCounselSessions 내에서 결정됨)
  const handleSearch = useCallback(() => {
    console.log('검색 요청 전달');
    refetch();
  }, [refetch]);

  return (
    <div className="bg-white min-h-screen">
      {/* 페이지 헤더 */}
      <Header
        title="상담 일정 관리"
        description="내담자의 상담 일정을 관리합니다"
      />

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          {/* 페이지 제목 */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">상담 일정 관리</h1>
          </div>

          {/* 필터 섹션 */}
          <FilterSection onSearch={handleSearch} />

          {/* 테이블 섹션 */}
          <ScheduleTableSection />
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
