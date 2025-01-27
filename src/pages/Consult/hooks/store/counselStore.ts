import { create } from 'zustand';
import { selectCounseleeBaseInformation } from '@/api/counsel'; // API 함수 경로는 실제 환경에 맞게 수정해주세요

interface CounselState {
  counseleeInfo: SelectCounseleeBaseInformationResponse;
  counselSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
  fetchCounseleeInfo: (sessionId: string) => Promise<void>;
}

export const useCounselStore = create<CounselState>((set) => ({
  counseleeInfo: null,
  counselSessionId: null,
  isLoading: false,
  error: null,
  fetchCounseleeInfo: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await selectCounseleeBaseInformation(sessionId);
      set({ counseleeInfo: data, counselSessionId: sessionId });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
}));
