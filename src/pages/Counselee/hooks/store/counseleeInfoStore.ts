import { AddCounseleeReqGenderTypeEnum, DefaultApi } from '@/api/api';
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

interface FilterState {
  name: string;
  birthDates: string[];
  affiliatedWelfareInstitutions: string[];
}

interface FilterOptions {
  birthDatesOptions: { label: string; value: string }[];
  institutionsOptions: { label: string; value: string }[];
}

// 통합된 스토어 상태 타입
interface CounseleeState {
  counseleeInfo: CounseleeInfo;
  filter: FilterState;
  filterOptions: FilterOptions;

  // 상태 업데이트 액션
  setCounseleeInfo: (info: CounseleeInfo) => void;
  setFilter: (filter: Partial<FilterState>) => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  clearFilters: () => void;

  // API 관련 액션
  fetchBirthDates: () => Promise<void>;
  fetchInstitutions: () => Promise<void>;
}

const defaultApi = new DefaultApi();

// 초기 상태
const initialState = {
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
};

export const useCounseleeStore = create<CounseleeState>((set) => ({
  ...initialState,

  setCounseleeInfo: (info) => set({ counseleeInfo: info }),

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),

  setFilterOptions: (options) =>
    set((state) => ({
      filterOptions: { ...state.filterOptions, ...options },
    })),

  clearFilters: () =>
    set((state) => ({
      ...state,
      filter: initialState.filter,
    })),

  fetchBirthDates: async () => {
    try {
      const response = await defaultApi.getBirthDates();
      const options =
        response.data.data?.map((date: string) => ({
          label: date.replace(
            /^(\d{4})-(\d{2})-(\d{2})$/,
            (_, year, month, day) => `${year.slice(2)}${month}${day}`,
          ),
          value: date,
        })) || [];

      set((state) => ({
        filterOptions: {
          ...state.filterOptions,
          birthDatesOptions: options,
        },
      }));
    } catch (error) {
      console.error('생년월일 목록 조회 실패:', error);
      throw error;
    }
  },

  fetchInstitutions: async () => {
    try {
      const response = await defaultApi.getAffiliatedWelfareInstitutions();
      const options =
        response.data.data?.map((institution: string) => ({
          label: institution,
          value: institution,
        })) || [];

      set((state) => ({
        filterOptions: {
          ...state.filterOptions,
          institutionsOptions: options,
        },
      }));
    } catch (error) {
      console.error('연계 기관 목록 조회 실패:', error);
      throw error;
    }
  },
}));

export const selectNameFilter = (state: CounseleeState) => state.filter.name;
export const selectBirthDates = (state: CounseleeState) =>
  state.filter.birthDates;
export const selectAffiliatedInstitutions = (state: CounseleeState) =>
  state.filter.affiliatedWelfareInstitutions;
