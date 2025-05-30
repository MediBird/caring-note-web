import { create } from 'zustand';
import type { CounselSessionStatRes } from '@/api/models';

export interface SessionStatsState {
  data: CounselSessionStatRes | null;
  isLoading: boolean;
  error: string | null;
}

export interface SessionStatsActions {
  setData: (data: CounselSessionStatRes) => void;
  clearData: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export type SessionStatsStore = SessionStatsState & SessionStatsActions;

export const useSessionStatsStore = create<SessionStatsStore>((set) => ({
  // 초기 상태
  data: null,
  isLoading: false,
  error: null,

  // 액션
  setData: (data) => set({ data, error: null }),
  clearData: () => set({ data: null, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
