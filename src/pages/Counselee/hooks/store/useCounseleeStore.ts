import { PageResSelectCounseleeRes, SelectCounseleeRes } from '@/api';
import { create } from 'zustand';

export interface CounseleeFilters {
  name?: string;
  birthDates?: string[];
  affiliatedWelfareInstitutions?: string[];
}

export interface CounseleePagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CounseleeState {
  filters: CounseleeFilters;
  pagination: CounseleePagination;
  counselees: SelectCounseleeRes[];
  isLoading: boolean;
  error: string | null;
  // isDirty?: boolean | Record<string, boolean>; // 필터 변경 여부 추적용 (옵션)
}

export interface CounseleeActions {
  setFilters: (filters: Partial<CounseleeFilters>) => void;
  setPagination: (pagination: Partial<CounseleePagination>) => void;
  setPage: (page: number) => void; // 페이지 변경 편의 함수
  setSize: (size: number) => void; // 사이즈 변경 편의 함수
  setCounselees: (data: PageResSelectCounseleeRes | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetFilters: () => void;
  resetState: () => void; // 전체 상태 초기화
}

export type CounseleeStore = CounseleeState & CounseleeActions;

const initialFilters: CounseleeFilters = {
  name: undefined,
  birthDates: undefined,
  affiliatedWelfareInstitutions: undefined,
};

const initialPagination: CounseleePagination = {
  page: 0, // API는 0-based page index를 사용
  size: 10,
  totalElements: 0,
  totalPages: 0,
};

const initialState: CounseleeState = {
  filters: initialFilters,
  pagination: initialPagination,
  counselees: [],
  isLoading: false,
  error: null,
};

export const useCounseleeStore = create<CounseleeStore>((set, get) => ({
  ...initialState,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 0 }, // 필터 변경 시 페이지 0으로 리셋
      // isDirty: true, // 필터 변경 시 isDirty 플래그 업데이트 (옵션)
    })),

  setPagination: (newPagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    })),

  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, page },
    })),

  setSize: (size) =>
    set((state) => ({
      pagination: { ...state.pagination, size, page: 0 }, // 사이즈 변경 시 페이지 0으로 리셋
    })),

  setCounselees: (data) =>
    set((state) => ({
      counselees: data?.content || [],
      pagination: {
        ...state.pagination,
        totalElements: data?.totalElements || 0,
        totalPages: data?.totalPages || 0,
      },
      isLoading: false,
      error: null,
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  resetFilters: () =>
    set({
      filters: initialFilters,
      pagination: { ...get().pagination, page: 0 }, // 필터 리셋 시 페이지 0으로
    }),

  resetState: () => set(initialState),
}));
