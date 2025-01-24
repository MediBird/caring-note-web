import { AddCounseleeReqGenderTypeEnum } from '@/api/api';
import { create } from 'zustand';

// 내담자 정보 관련 상태 관리
export interface counseleeInfoType {
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

export interface CounseleeInfoState {
  counseleeInfo: counseleeInfoType;
  setCounseleeInfo: (
    counseleeInfo: CounseleeInfoState['counseleeInfo'],
  ) => void;
}

// 실제 사용하는 훅
export const useCounseleeInfoStore = create<CounseleeInfoState>()((set) => ({
  counseleeInfo: {
    name: '',
    phoneNumber: '',
    dateOfBirth: '',
    genderType: AddCounseleeReqGenderTypeEnum.Else,
    address: '',
    note: '',
    careManagerName: '',
    disability: undefined,
    affiliatedWelfareInstitution: '',
  },
  setCounseleeInfo: (counseleeInfo: CounseleeInfoState['counseleeInfo']) =>
    set({ counseleeInfo }),
}));
