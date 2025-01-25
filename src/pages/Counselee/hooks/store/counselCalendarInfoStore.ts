import { AddCounselSessionReqStatusEnum } from '@/api/api';
import { create } from 'zustand';

// 상담 일정 정보 관련 상태 관리
export interface counselCalendarInfoType {
  counseleeId: string;
  counselorId: string;
  scheduledStartDateTime: string;
  status: string;
}

export interface CounselCalendarInfoState {
  counselCalendarInfo: counselCalendarInfoType;
  setCounselCalendarInfo: (
    counselCalendarInfo: CounselCalendarInfoState['counselCalendarInfo'],
  ) => void;
}

// 실제 사용하는 훅
export const useCounselCalendarInfoStore = create<CounselCalendarInfoState>()(
  (set) => ({
    counselCalendarInfo: {
      counseleeId: '',
      counselorId: '',
      scheduledStartDateTime: '',
      status: AddCounselSessionReqStatusEnum.Scheduled,
    },
    setCounselCalendarInfo: (
      counselCalendarInfo: CounselCalendarInfoState['counselCalendarInfo'],
    ) => set({ counselCalendarInfo }),
  }),
);
