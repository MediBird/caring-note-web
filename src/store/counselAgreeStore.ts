import { UpdateCounseleeConsentReq } from '@/api';
import { create } from 'zustand';

// 정보 제공 동의 관련 상태 관리
interface counselAgreeState {
  counseleeConsent: UpdateCounseleeConsentReq;
  setCounseleeConsent: (newDetail: UpdateCounseleeConsentReq) => void;
  updatedCounseleeConsentId: string;
  setUpdatedCounseleeConsentId: (newId: string) => void;
}
// 실제 사용하는 훅
export const useCounselAgreeSessionStore = create<counselAgreeState>((set) => ({
  counseleeConsent: {} as UpdateCounseleeConsentReq,
  setCounseleeConsent: (newDetail) => set({ counseleeConsent: newDetail }),
  updatedCounseleeConsentId: '',
  setUpdatedCounseleeConsentId: (newId) =>
    set({ updatedCounseleeConsentId: newId }),
}));
