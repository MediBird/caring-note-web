import { create } from 'zustand';
import {
  SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  TimeRecordedResObject,
} from '@/api';

// 히스토리 상태 인터페이스
export interface HistoryState {
  historyData: Record<
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
    TimeRecordedResObject[]
  >;
  isLoading: Record<
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
    boolean
  >;
  error: Record<
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
    string | null
  >;
  currentCounselSessionId: string | null;
}

// 히스토리 액션 인터페이스
export interface HistoryActions {
  setHistoryData: (
    type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
    data: TimeRecordedResObject[],
  ) => void;
  setLoading: (
    type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
    isLoading: boolean,
  ) => void;
  setError: (
    type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
    error: string | null,
  ) => void;
  setCounselSessionId: (counselSessionId: string) => void;
  clearHistoryData: () => void;
  getHistoryData: (
    type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  ) => TimeRecordedResObject[];
  isHistoryLoading: (
    type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  ) => boolean;
  hasHistoryData: (
    type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  ) => boolean;
}

export type HistoryStore = HistoryState & HistoryActions;

// 초기 상태 생성 함수
const createInitialState = (): HistoryState => {
  const types = Object.values(
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  );

  return {
    historyData: types.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
        TimeRecordedResObject[]
      >,
    ),
    isLoading: types.reduce(
      (acc, type) => {
        acc[type] = false;
        return acc;
      },
      {} as Record<
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
        boolean
      >,
    ),
    error: types.reduce(
      (acc, type) => {
        acc[type] = null;
        return acc;
      },
      {} as Record<
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
        string | null
      >,
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

  getHistoryData: (type) => get().historyData[type] || [],

  isHistoryLoading: (type) => get().isLoading[type] || false,

  hasHistoryData: (type) => {
    const data = get().historyData[type];
    return data && data.length > 0;
  },
}));
