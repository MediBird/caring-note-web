import {
  CounselCardBaseInformationRes,
  CounselCardHealthInformationRes,
  CounselCardIndependentLifeInformationRes,
  CounselCardLivingInformationRes,
} from '@/api';
import { create } from 'zustand';

// 정보 타입 정의
export type InfoType = 'base' | 'health' | 'independentLife' | 'living';

// 상태 플래그 타입
type StatusFlags = Record<InfoType, boolean>;
type ErrorFlags = Record<InfoType, string | null>;
type InfoData = {
  base: Partial<CounselCardBaseInformationRes> | null;
  health: Partial<CounselCardHealthInformationRes> | null;
  independentLife: Partial<CounselCardIndependentLifeInformationRes> | null;
  living: Partial<CounselCardLivingInformationRes> | null;
};

export interface CounselCardState {
  counselSessionId: string | null;
  // 정보 데이터
  infoData: InfoData;
  // 상태 플래그
  fetchedSessionIds: Record<InfoType, string | null>;
  shouldFetch: StatusFlags;
  isLoading: StatusFlags;
  error: ErrorFlags;

  // 액션: 세션 ID 설정
  setCounselSessionId: (id: string) => void;

  // 액션: 정보 업데이트 (통합 함수)
  setInfoData: <T extends InfoType>(infoType: T, data: InfoData[T]) => void;

  // 액션: 플래그 관리 (통합 함수)
  setShouldFetch: (infoType: InfoType, shouldFetch: boolean) => void;
  setFetchedSessionId: (infoType: InfoType, id: string) => void;
  setLoading: (infoType: InfoType, isLoading: boolean) => void;
  setError: (infoType: InfoType, error: string | null) => void;

  // 상태 초기화
  clearAll: () => void;
}

// 초기 상태
const initialInfoData: InfoData = {
  base: null,
  health: null,
  independentLife: null,
  living: null,
};

const initialStatusFlags: StatusFlags = {
  base: false,
  health: false,
  independentLife: false,
  living: false,
};

const initialShouldFetch: StatusFlags = {
  base: true,
  health: true,
  independentLife: true,
  living: true,
};

const initialFetchedSessionIds = {
  base: null,
  health: null,
  independentLife: null,
  living: null,
};

const initialError: ErrorFlags = {
  base: null,
  health: null,
  independentLife: null,
  living: null,
};

export const useCounselCardStore = create<CounselCardState>((set) => ({
  // 초기 상태
  counselSessionId: null,
  infoData: { ...initialInfoData },
  fetchedSessionIds: { ...initialFetchedSessionIds },
  shouldFetch: { ...initialShouldFetch },
  isLoading: { ...initialStatusFlags },
  error: { ...initialError },

  // 세션 ID 설정 (데이터 초기화 포함)
  setCounselSessionId: (id) =>
    set((state) => {
      const isSameSession = state.counselSessionId === id;

      if (isSameSession) {
        return { counselSessionId: id };
      }

      // 세션이 변경된 경우 상태 초기화
      return {
        counselSessionId: id,
        infoData: { ...initialInfoData },
        fetchedSessionIds: { ...initialFetchedSessionIds },
        shouldFetch: { ...initialShouldFetch },
      };
    }),

  // 통합된 정보 설정 함수
  setInfoData: (infoType, data) =>
    set((state) => ({
      infoData: {
        ...state.infoData,
        [infoType]: data,
      },
    })),

  // 플래그 관리 함수
  setShouldFetch: (infoType, shouldFetch) =>
    set((state) => ({
      shouldFetch: { ...state.shouldFetch, [infoType]: shouldFetch },
    })),

  setFetchedSessionId: (infoType, id) =>
    set((state) => ({
      fetchedSessionIds: { ...state.fetchedSessionIds, [infoType]: id },
    })),

  setLoading: (infoType, isLoading) =>
    set((state) => ({
      isLoading: { ...state.isLoading, [infoType]: isLoading },
    })),

  setError: (infoType, error) =>
    set((state) => ({
      error: { ...state.error, [infoType]: error },
    })),

  // 상태 초기화 함수
  clearAll: () =>
    set({
      counselSessionId: null,
      infoData: { ...initialInfoData },
      fetchedSessionIds: { ...initialFetchedSessionIds },
      shouldFetch: { ...initialShouldFetch },
    }),
}));

// 레거시 호환을 위한 선택자 함수들
export const getBaseInfo = (state: CounselCardState) => state.infoData.base;
export const getHealthInfo = (state: CounselCardState) => state.infoData.health;
export const getIndependentLifeInfo = (state: CounselCardState) =>
  state.infoData.independentLife;
export const getLivingInfo = (state: CounselCardState) => state.infoData.living;

// 레거시 호환을 위한 액션 함수들
export const setBaseInfo = (data: Partial<CounselCardBaseInformationRes>) => {
  useCounselCardStore.getState().setInfoData('base', data);
};

export const setHealthInfo = (
  data: Partial<CounselCardHealthInformationRes>,
) => {
  useCounselCardStore.getState().setInfoData('health', data);
};

export const setIndependentLifeInfo = (
  data: Partial<CounselCardIndependentLifeInformationRes>,
) => {
  useCounselCardStore.getState().setInfoData('independentLife', data);
};

export const setLivingInfo = (
  data: Partial<CounselCardLivingInformationRes>,
) => {
  useCounselCardStore.getState().setInfoData('living', data);
};
