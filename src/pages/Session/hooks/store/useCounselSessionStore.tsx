import {
  CreateCounselReservationReq,
  ModifyCounselReservationReq,
  SelectCounselSessionListItem,
} from '@/api/api';
import { create } from 'zustand';

// 상담 세션 조회 파라미터 저장소
interface FetchParams {
  baseDate?: string;
  cursor?: string;
  size?: number;
  page?: number;
  counseleeNameKeyword?: string;
  counselorNames?: string[];
  scheduledDates?: string[];
}

interface ParamsState {
  params: FetchParams;
  setParams: (newParams: Partial<FetchParams>) => void;
  resetParams: () => void;
}

export const useCounselSessionParamsStore = create<ParamsState>((set) => ({
  params: {
    baseDate: undefined,
    size: 10,
    page: 0,
    counseleeNameKeyword: undefined,
    counselorNames: undefined,
    scheduledDates: undefined,
  },
  setParams: (newParams) =>
    set((state) => ({ params: { ...state.params, ...newParams } })),
  resetParams: () =>
    set({
      params: {
        baseDate: undefined,
        size: 10,
        page: 0,
        counseleeNameKeyword: undefined,
        counselorNames: undefined,
        scheduledDates: undefined,
      },
    }),
}));

// 상담 세션 상세 정보 저장소
interface DetailState {
  detail?: SelectCounselSessionListItem;
  setDetail: (newDetail: SelectCounselSessionListItem) => void;
  resetDetail: () => void;
}

export const useCounselSessionDetailStore = create<DetailState>((set) => ({
  detail: undefined,
  setDetail: (newDetail) => set({ detail: newDetail }),
  resetDetail: () => set({ detail: undefined }),
}));

// 상담사 목록 저장소
interface CounselorListState {
  counselors: string[];
  setCounselors: (counselors: string[]) => void;
}

export const useCounselorListStore = create<CounselorListState>((set) => ({
  counselors: [],
  setCounselors: (counselors) => set({ counselors }),
}));

// 상담 세션 날짜 목록 저장소
interface SessionDateState {
  dates: string[];
  setDates: (dates: string[]) => void;
  year: number;
  month: number;
  setYearMonth: (year: number, month: number) => void;
}

export const useSessionDateStore = create<SessionDateState>((set) => ({
  dates: [],
  setDates: (dates) => set({ dates }),
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  setYearMonth: (year, month) => set({ year, month }),
}));

// 새 상담 세션 생성 폼 저장소
interface AddSessionFormState {
  form: Partial<CreateCounselReservationReq>;
  setForm: (newForm: Partial<CreateCounselReservationReq>) => void;
  resetForm: () => void;
}

export const useAddSessionFormStore = create<AddSessionFormState>((set) => ({
  form: {},
  setForm: (newForm) =>
    set((state) => ({ form: { ...state.form, ...newForm } })),
  resetForm: () => set({ form: {} }),
}));

// 상담 세션 업데이트 폼 저장소
interface UpdateSessionFormState {
  form: Partial<ModifyCounselReservationReq>;
  setForm: (newForm: Partial<ModifyCounselReservationReq>) => void;
  resetForm: () => void;
}

export const useUpdateSessionFormStore = create<UpdateSessionFormState>(
  (set) => ({
    form: {},
    setForm: (newForm) =>
      set((state) => ({ form: { ...state.form, ...newForm } })),
    resetForm: () => set({ form: {} }),
  }),
);
