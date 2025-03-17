import { SelectCounselSessionListItem } from '@/api';
import { create } from 'zustand';

interface FetchParams {
  baseDate: string;
  cursor?: string;
  size: number;
}

interface ParamsState {
  params?: Partial<FetchParams>;
  setParams: (newParams: Partial<FetchParams>) => void;
}

export const useCounselSessionStore = create<ParamsState>((set) => ({
  params: undefined,
  setParams: (newParams) =>
    set((state) => ({ params: { ...state.params, ...newParams } })),
}));

interface DetailState {
  detail?: SelectCounselSessionListItem;
  setDetail: (newDetail: SelectCounselSessionListItem) => void;
  resetDetail: () => void;
}

export const useDetailCounselSessionStore = create<DetailState>((set) => ({
  detail: undefined,
  setDetail: (newDetail) => set({ detail: newDetail }),
  resetDetail: () => set({ detail: undefined }),
}));
