import {
  CounseleeControllerApi,
  SelectCounseleeAutocompleteRes,
} from '@/api/api';
import { useQuery } from '@tanstack/react-query';

const counseleeControllerApi = new CounseleeControllerApi();

export const useCounseleeAutocomplete = (keyword: string) => {
  return useQuery<SelectCounseleeAutocompleteRes[], Error>({
    queryKey: [keyword],
    queryFn: async () => {
      if (!keyword || keyword.length < 1) return [];

      const response = await counseleeControllerApi.autocompleteCounselees(
        keyword,
      );
      return response.data.data || [];
    },
    enabled: keyword.length > 0,
  });
};
