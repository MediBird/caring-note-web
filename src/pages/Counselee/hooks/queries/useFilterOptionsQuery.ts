import { CounseleeControllerApi } from '@/api';
import { useQuery } from '@tanstack/react-query';

const counseleeControllerApi = new CounseleeControllerApi();

export interface FilterOption {
  label: string;
  value: string;
}

const fetchBirthDates = async (): Promise<FilterOption[]> => {
  try {
    const response = await counseleeControllerApi.getBirthDates();
    return (
      response.data.data?.map((date: string) => ({
        label: date.replace(
          /^(\d{4})-(\d{2})-(\d{2})$/,
          (_, year, month, day) => `${year.slice(2)}${month}${day}`,
        ),
        value: date,
      })) || []
    );
  } catch (error) {
    console.error('생년월일 목록 조회 실패:', error);
    throw error;
  }
};

const fetchInstitutions = async (): Promise<FilterOption[]> => {
  try {
    const response =
      await counseleeControllerApi.getAffiliatedWelfareInstitutions();
    return (
      response.data.data?.map((institution: string) => ({
        label: institution,
        value: institution,
      })) || []
    );
  } catch (error) {
    console.error('연계 기관 목록 조회 실패:', error);
    throw error;
  }
};

export const useBirthDatesQuery = () => {
  return useQuery({
    queryKey: ['birthDates'],
    queryFn: fetchBirthDates,
  });
};

export const useInstitutionsQuery = () => {
  return useQuery({
    queryKey: ['institutions'],
    queryFn: fetchInstitutions,
  });
};
