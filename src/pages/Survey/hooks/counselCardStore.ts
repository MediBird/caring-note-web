import {
  CounselCardBaseInformationRes,
  CounselCardHealthInformationRes,
  CounselCardIndependentLifeInformationRes,
  CounselCardLivingInformationRes,
} from '@/api/api';
import { create } from 'zustand';

// 기본 정보 스토어
export interface CounselCardBaseInfoState {
  baseInfo: Partial<CounselCardBaseInformationRes> | null;
  isLoading: boolean;
  error: string | null;
  setBaseInfo: (data: Partial<CounselCardBaseInformationRes>) => void;
  clearBaseInfo: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCounselCardBaseInfoStore = create<CounselCardBaseInfoState>((set) => ({
  baseInfo: null,
  isLoading: false,
  error: null,
  setBaseInfo: (data) => set({ baseInfo: data }),
  clearBaseInfo: () => set({ baseInfo: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// 건강 정보 스토어
export interface CounselCardHealthInfoState {
  healthInfo: Partial<CounselCardHealthInformationRes> | null;
  isLoading: boolean;
  error: string | null;
  setHealthInfo: (data: Partial<CounselCardHealthInformationRes>) => void;
  clearHealthInfo: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCounselCardHealthInfoStore = create<CounselCardHealthInfoState>(
  (set) => ({
    healthInfo: null,
    isLoading: false,
    error: null,
    setHealthInfo: (data) => set({ healthInfo: data }),
    clearHealthInfo: () => set({ healthInfo: null }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  }),
);

// 독립생활 평가 스토어
export interface CounselCardIndependentLifeInfoState {
  independentLifeInfo: Partial<CounselCardIndependentLifeInformationRes> | null;
  isLoading: boolean;
  error: string | null;
  setIndependentLifeInfo: (
    data: Partial<CounselCardIndependentLifeInformationRes>,
  ) => void;
  clearIndependentLifeInfo: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCounselCardIndependentLifeInfoStore =
  create<CounselCardIndependentLifeInfoState>((set) => ({
    independentLifeInfo: null,
    isLoading: false,
    error: null,
    setIndependentLifeInfo: (data) => set({ independentLifeInfo: data }),
    clearIndependentLifeInfo: () => set({ independentLifeInfo: null }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  }));

// 생활 정보 스토어
export interface CounselCardLivingInfoState {
  livingInfo: Partial<CounselCardLivingInformationRes> | null;
  isLoading: boolean;
  error: string | null;
  setLivingInfo: (data: Partial<CounselCardLivingInformationRes>) => void;
  clearLivingInfo: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCounselCardLivingInfoStore = create<CounselCardLivingInfoState>(
  (set) => ({
    livingInfo: null,
    isLoading: false,
    error: null,
    setLivingInfo: (data) => set({ livingInfo: data }),
    clearLivingInfo: () => set({ livingInfo: null }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  }),
);


