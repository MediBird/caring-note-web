import { MedicationControllerApi } from '@/api';
import { useQuery } from '@tanstack/react-query';

const medicationApi = new MedicationControllerApi();

const searchMedicationByKeyword = async (keyword: string) => {
  const response = await medicationApi.searchMedicationByKeyword(keyword);

  return response.data.data ?? [];
};

export const useSearchMedicationByKeyword = (keyword: string) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['searchMedicationByKeyword', keyword],
    queryFn: () => searchMedicationByKeyword(keyword),
    enabled: keyword.length > 1,
  });

  return { data: data ?? [], isSuccess };
};
