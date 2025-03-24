import {
  CounselCardBaseInformationRes,
  CounselCardHealthInformationRes,
  CounselCardIndependentLifeInformationRes,
  CounselCardLivingInformationRes,
} from '@/api';
import { create } from 'zustand';

export interface CounselCardState {
  counselSessionId: string | null;
  baseInfo: Partial<CounselCardBaseInformationRes> | null;
  healthInfo: Partial<CounselCardHealthInformationRes> | null;
  independentLifeInfo: Partial<CounselCardIndependentLifeInformationRes> | null;
  livingInfo: Partial<CounselCardLivingInformationRes> | null;
  fetchedSessionIds: {
    base: string | null;
    health: string | null;
    independentLife: string | null;
    living: string | null;
  };
  shouldFetch: {
    base: boolean;
    health: boolean;
    independentLife: boolean;
    living: boolean;
  };
  isDirty: {
    base: boolean;
    health: boolean;
    independentLife: boolean;
    living: boolean;
  };
  isLoading: {
    base: boolean;
    health: boolean;
    independentLife: boolean;
    living: boolean;
  };
  error: {
    base: string | null;
    health: string | null;
    independentLife: string | null;
    living: string | null;
  };
  setCounselSessionId: (id: string) => void;
  setShouldFetch: (
    key: 'base' | 'health' | 'independentLife' | 'living',
    shouldFetch: boolean,
  ) => void;
  setFetchedSessionId: (
    key: 'base' | 'health' | 'independentLife' | 'living',
    id: string,
  ) => void;
  setBaseInfo: (data: Partial<CounselCardBaseInformationRes>) => void;
  setHealthInfo: (data: Partial<CounselCardHealthInformationRes>) => void;
  setIndependentLifeInfo: (
    data: Partial<CounselCardIndependentLifeInformationRes>,
  ) => void;
  setLivingInfo: (data: Partial<CounselCardLivingInformationRes>) => void;
  clearAll: () => void;
  setLoading: (
    key: 'base' | 'health' | 'independentLife' | 'living',
    isLoading: boolean,
  ) => void;
  setError: (
    key: 'base' | 'health' | 'independentLife' | 'living',
    error: string | null,
  ) => void;
  resetDirty: () => void;
}

export const useCounselCardStore = create<CounselCardState>((set) => ({
  counselSessionId: null,
  baseInfo: null,
  healthInfo: null,
  independentLifeInfo: null,
  livingInfo: null,
  fetchedSessionIds: {
    base: null,
    health: null,
    independentLife: null,
    living: null,
  },
  shouldFetch: {
    base: true,
    health: true,
    independentLife: true,
    living: true,
  },
  isDirty: {
    base: false,
    health: false,
    independentLife: false,
    living: false,
  },
  isLoading: {
    base: false,
    health: false,
    independentLife: false,
    living: false,
  },
  error: {
    base: null,
    health: null,
    independentLife: null,
    living: null,
  },
  setCounselSessionId: (id) =>
    set((state) => {
      const isSameSession = state.counselSessionId === id;

      return {
        counselSessionId: id,
        shouldFetch: isSameSession
          ? state.shouldFetch
          : {
              base: true,
              health: true,
              independentLife: true,
              living: true,
            },
        isDirty: isSameSession
          ? state.isDirty
          : {
              base: false,
              health: false,
              independentLife: false,
              living: false,
            },
      };
    }),
  setShouldFetch: (key, shouldFetch) =>
    set((state) => ({
      shouldFetch: { ...state.shouldFetch, [key]: shouldFetch },
    })),
  setFetchedSessionId: (key, id) =>
    set((state) => ({
      fetchedSessionIds: { ...state.fetchedSessionIds, [key]: id },
    })),
  setBaseInfo: (data) =>
    set((state) => ({
      baseInfo: data,
      isDirty: { ...state.isDirty, base: true },
    })),
  setHealthInfo: (data) =>
    set((state) => ({
      healthInfo: data,
      isDirty: { ...state.isDirty, health: true },
    })),
  setIndependentLifeInfo: (data) =>
    set((state) => ({
      independentLifeInfo: data,
      isDirty: { ...state.isDirty, independentLife: true },
    })),
  setLivingInfo: (data) =>
    set((state) => ({
      livingInfo: data,
      isDirty: { ...state.isDirty, living: true },
    })),
  clearAll: () =>
    set({
      baseInfo: null,
      healthInfo: null,
      independentLifeInfo: null,
      livingInfo: null,
      fetchedSessionIds: {
        base: null,
        health: null,
        independentLife: null,
        living: null,
      },
      shouldFetch: {
        base: true,
        health: true,
        independentLife: true,
        living: true,
      },
      isDirty: {
        base: false,
        health: false,
        independentLife: false,
        living: false,
      },
    }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      isLoading: { ...state.isLoading, [key]: isLoading },
    })),
  setError: (key, error) =>
    set((state) => ({
      error: { ...state.error, [key]: error },
    })),
  resetDirty: () =>
    set(() => ({
      isDirty: {
        base: false,
        health: false,
        independentLife: false,
        living: false,
      },
    })),
}));


