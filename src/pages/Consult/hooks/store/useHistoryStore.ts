import { create } from 'zustand';
import { SelectPreviousItemListByInformationNameAndItemNameTypeEnum } from '@/api';

// 로컬 히스토리 타입 추가 (API enum에 없는 분리된 타입들)
export const LocalHistoryTypeEnum = {
  CounselPurpose: 'COUNSEL_PURPOSE',
  SignificantNote: 'SIGNIFICANT_NOTE',
  MedicationNote: 'MEDICATION_NOTE',
  Diseases: 'DISEASES',
  DiseaseHistoryNote: 'DISEASE_HISTORY_NOTE',
  MainInconvenienceNote: 'MAIN_INCONVENIENCE_NOTE',
} as const;

export type LocalHistoryType =
  (typeof LocalHistoryTypeEnum)[keyof typeof LocalHistoryTypeEnum];

// 통합 히스토리 타입 (API enum + 로컬 enum)
export type AllHistoryType =
  | SelectPreviousItemListByInformationNameAndItemNameTypeEnum
  | LocalHistoryType;

// 히스토리 데이터의 기본 구조
interface BaseTimeRecordedRes {
  counselDate?: string;
  data?: unknown;
}

// 히스토리 상태 인터페이스
export interface HistoryState {
  historyData: Record<AllHistoryType, BaseTimeRecordedRes[] | null>;
  isLoading: Record<AllHistoryType, boolean>;
  error: Record<AllHistoryType, string | null>;
  currentCounselSessionId: string | null;
}

// 히스토리 액션 인터페이스
export interface HistoryActions {
  setHistoryData: (type: AllHistoryType, data: BaseTimeRecordedRes[]) => void;
  setLoading: (type: AllHistoryType, isLoading: boolean) => void;
  setError: (type: AllHistoryType, error: string | null) => void;
  setCounselSessionId: (counselSessionId: string) => void;
  clearHistoryData: () => void;
  resetHistoryForSession: (counselSessionId: string) => void;
  getHistoryData: (type: AllHistoryType) => BaseTimeRecordedRes[];
  isHistoryLoading: (type: AllHistoryType) => boolean;
  hasHistoryData: (type: AllHistoryType) => boolean;
  isHistoryInitialized: (type: AllHistoryType) => boolean;
}

export type HistoryStore = HistoryState & HistoryActions;

// 초기 상태 생성 함수
const createInitialState = (): HistoryState => {
  const apiTypes = Object.values(
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  );
  const localTypes = Object.values(LocalHistoryTypeEnum);
  const allTypes = [...apiTypes, ...localTypes] as AllHistoryType[];

  return {
    historyData: allTypes.reduce(
      (acc, type) => {
        acc[type] = null;
        return acc;
      },
      {} as Record<AllHistoryType, BaseTimeRecordedRes[] | null>,
    ),
    isLoading: allTypes.reduce(
      (acc, type) => {
        acc[type] = false;
        return acc;
      },
      {} as Record<AllHistoryType, boolean>,
    ),
    error: allTypes.reduce(
      (acc, type) => {
        acc[type] = null;
        return acc;
      },
      {} as Record<AllHistoryType, string | null>,
    ),
    currentCounselSessionId: null,
  };
};

// Zustand 스토어 생성
export const useHistoryStore = create<HistoryStore>((set, get) => ({
  ...createInitialState(),

  setHistoryData: (type, data) =>
    set((state) => ({
      historyData: {
        ...state.historyData,
        [type]: data,
      },
    })),

  setLoading: (type, isLoading) =>
    set((state) => ({
      isLoading: {
        ...state.isLoading,
        [type]: isLoading,
      },
    })),

  setError: (type, error) =>
    set((state) => ({
      error: {
        ...state.error,
        [type]: error,
      },
    })),

  setCounselSessionId: (counselSessionId) =>
    set({ currentCounselSessionId: counselSessionId }),

  clearHistoryData: () => set(createInitialState()),

  resetHistoryForSession: (counselSessionId) => {
    const currentSessionId = get().currentCounselSessionId;
    if (currentSessionId !== counselSessionId) {
      set({
        ...createInitialState(),
        currentCounselSessionId: counselSessionId,
      });
    }
  },

  getHistoryData: (type) => get().historyData[type] || [],

  isHistoryLoading: (type) => get().isLoading[type] || false,

  hasHistoryData: (type) => {
    const data = get().historyData[type];
    return Array.isArray(data) && data.length > 0;
  },

  isHistoryInitialized: (type) => {
    const data = get().historyData[type];
    return data !== null;
  },
}));
