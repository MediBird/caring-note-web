import { Header } from '../../components/ui/Header';
import { CounselSessionTableSection } from './components/CounselSessionTableSection';
import { FilterSection } from './components/FilterSection';

/**
 * 상담 일정 관리 페이지
 *
 * 상담 일정을 조회, 등록, 수정, 삭제할 수 있는 페이지입니다.
 * FilterSection과 ScheduleTableSection 컴포넌트로 구성되어 있으며,
 * 각 컴포넌트는 Zustand 스토어를 통해 상태를 공유합니다.
 */
const SessionManagement = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* 페이지 헤더 */}
      <Header title="상담 일정 관리" description="내담자의 복약 상담 내역" />

      {/* 메인 콘텐츠 */}
      <div className="flex justify-center pt-5 px-layout max-w-layout mx-auto w-full">
        <div className="flex flex-col gap-5 w-full">
          {/* 필터 섹션 */}
          <FilterSection />

          {/* 테이블 섹션 */}
          <CounselSessionTableSection />
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
