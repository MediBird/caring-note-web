import { CounselorListItem } from '@/api/models/counselor-list-item';
import { PageResCounselorInfoListRes } from '@/api/models/page-res-counselor-info-list-res';
import { PageRes } from '@/api/models/page-res';
import { create } from 'zustand';

// 상담사 목록 조회 파라미터
export interface CounselorFetchParams {
  page?: number;
  size?: number;
}

// 상담사 저장소 인터페이스
interface CounselorStoreState {
  // 상담사 목록 데이터
  counselors: CounselorListItem[];
  // 페이지 정보
  pageInfo: PageRes | null;
  // 선택된 상담사 ID
  selectedCounselorId: string | null;
  // 로딩 상태
  isLoading: boolean;
  // 에러 메시지
  error: string | null;

  // 액션 메소드들
  setCounselors: (data: PageResCounselorInfoListRes | undefined) => void;
  setSelectedCounselorId: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

// Zustand 스토어 생성
export const useCounselorStore = create<CounselorStoreState>((set) => ({
  counselors: [],
  pageInfo: null,
  selectedCounselorId: null,
  isLoading: false,
  error: null,

  setCounselors: (data) =>
    set({
      counselors: data?.content || [],
      pageInfo: {
        totalPages: data?.totalPages || 1,
        totalElements: data?.totalElements || 0,
        currentPage: data?.page || 0,
        hasNext: data?.hasNext || false,
        hasPrevious: data?.hasPrevious || false,
      },
      error: null,
    }),

  setSelectedCounselorId: (id) =>
    set({
      selectedCounselorId: id,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  resetState: () =>
    set({
      counselors: [],
      pageInfo: null,
      selectedCounselorId: null,
      isLoading: false,
      error: null,
    }),
}));
