import { create } from 'zustand';
import { DefaultApi } from '@/api/api';

interface CounseleeOptionsState {
  birthDatesOptions: { label: string; value: string }[];
  institutionsOptions: { label: string; value: string }[];
  setBirthDatesOptions: (options: { label: string; value: string }[]) => void;
  setInstitutionsOptions: (options: { label: string; value: string }[]) => void;
  fetchBirthDates: () => Promise<void>;
  fetchInstitutions: () => Promise<void>;
}

const defaultApi = new DefaultApi();

export const useCounseleeOptionsStore = create<CounseleeOptionsState>(
  (set) => ({
    birthDatesOptions: [],
    institutionsOptions: [],
    setBirthDatesOptions: (options) => set({ birthDatesOptions: options }),
    setInstitutionsOptions: (options) => set({ institutionsOptions: options }),

    fetchBirthDates: async () => {
      try {
        const response = await defaultApi.getBirthDates();
        const options =
          response.data.data?.map((date: string) => ({
            label: date,
            value: date,
          })) || [];
        set({ birthDatesOptions: options });
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
        set({ institutionsOptions: options });
      } catch (error) {
        console.error('연계 기관 목록 조회 실패:', error);
        throw error;
      }
    },
  }),
);
