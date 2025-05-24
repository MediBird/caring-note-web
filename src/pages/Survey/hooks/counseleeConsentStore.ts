import { SelectCounseleeConsentByCounseleeIdRes } from '@/api';
import { create } from 'zustand';

export interface CounseleeConsentState {
  consentData: Partial<SelectCounseleeConsentByCounseleeIdRes> | null;
  isLoading: boolean;
  error: string | null;
  setConsentData: (
    data: Partial<SelectCounseleeConsentByCounseleeIdRes>,
  ) => void;
  clearConsentData: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCounseleeConsentStore = create<CounseleeConsentState>(
  (set) => ({
    consentData: null,
    isLoading: false,
    error: null,
    setConsentData: (data) => set({ consentData: data }),
    clearConsentData: () => set({ consentData: null }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  }),
);
