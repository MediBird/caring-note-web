import { AddCounseleeReqGenderTypeEnum } from '@/api';
import { create } from 'zustand';

// 기본 타입 정의
export interface CounseleeInfo {
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  genderType: AddCounseleeReqGenderTypeEnum;
  address: string;
  note: string;
  careManagerName: string;
  disability: boolean | undefined;
  affiliatedWelfareInstitution: string;
}

interface CounseleeInfoStore {
  counseleeInfo: CounseleeInfo;
  setCounseleeInfo: (info: CounseleeInfo) => void;
  resetCounseleeInfo: () => void;
}

const initialCounseleeInfo: CounseleeInfo = {
  name: '',
  phoneNumber: '',
  dateOfBirth: '',
  genderType: AddCounseleeReqGenderTypeEnum.Else,
  address: '',
  note: '',
  careManagerName: '',
  disability: undefined,
  affiliatedWelfareInstitution: '',
};

export const useCounseleeInfoStore = create<CounseleeInfoStore>((set) => ({
  counseleeInfo: initialCounseleeInfo,
  setCounseleeInfo: (info: CounseleeInfo) => set({ counseleeInfo: info }),
  resetCounseleeInfo: () => set({ counseleeInfo: initialCounseleeInfo }),
}));
