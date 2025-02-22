import { AddCounseleeReqGenderTypeEnum } from '@/api/api';
import { create } from 'zustand';

// 필터 타입 정의
export interface FilterState {
  name: string;
  birthDates: string[];
  affiliatedWelfareInstitutions: string[];
}

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

interface FilterOptionsState {
  birthDatesOptions: { label: string; value: string }[];
  institutionsOptions: { label: string; value: string }[];
}

export interface CounseleeInfoState {
  counseleeInfo: counseleeInfoType;
  filter: FilterState;
  filterOptions: FilterOptionsState;
  setCounseleeInfo: (
    counseleeInfo: CounseleeInfoState['counseleeInfo'],
  ) => void;
  setNameFilter: (name: string) => void;
  setBirthDatesFilter: (dates: string[]) => void;
  setAffiliatedWelfareInstitutionsFilter: (institutions: string[]) => void;
  setBirthDatesOptions: (options: { label: string; value: string }[]) => void;
  setInstitutionsOptions: (options: { label: string; value: string }[]) => void;
  clearFilters: () => void;
}

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
  filter: {
    name: '',
    birthDates: [],
    affiliatedWelfareInstitutions: [],
  },
  filterOptions: {
    birthDatesOptions: [],
    institutionsOptions: [],
  },
  setCounseleeInfo: (counseleeInfo) => set({ counseleeInfo }),
  setNameFilter: (name) =>
    set(
      (state) => ({
        ...state,
        filter: {
          ...state.filter,
          name,
        },
      }),
      true,
    ),
  setBirthDatesFilter: (birthDates) =>
    set((state) => ({
      filter: {
        ...state.filter,
        birthDates,
      },
    })),
  setAffiliatedWelfareInstitutionsFilter: (affiliatedWelfareInstitutions) =>
    set((state) => ({
      filter: {
        ...state.filter,
        affiliatedWelfareInstitutions,
      },
    })),
  setBirthDatesOptions: (birthDatesOptions) =>
    set((state) => ({
      filterOptions: {
        ...state.filterOptions,
        birthDatesOptions,
      },
    })),
  setInstitutionsOptions: (institutionsOptions) =>
    set((state) => ({
      filterOptions: {
        ...state.filterOptions,
        institutionsOptions,
      },
    })),
  clearFilters: () =>
    set(() => ({
      filter: {
        name: '',
        birthDates: [],
        affiliatedWelfareInstitutions: [],
      },
    })),
}));

export const selectNameFilter = (state: CounseleeInfoState) =>
  state.filter.name;
export const selectBirthDates = (state: CounseleeInfoState) =>
  state.filter.birthDates;
export const selectAffiliatedInstitutions = (state: CounseleeInfoState) =>
  state.filter.affiliatedWelfareInstitutions;
