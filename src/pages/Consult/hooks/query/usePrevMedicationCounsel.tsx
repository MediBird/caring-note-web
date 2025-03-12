import { MedicationCounselControllerApi } from '@/api';
import { useQuery } from '@tanstack/react-query';

const medicationCounselControllerApi = new MedicationCounselControllerApi();

const selectPreviousMedicationCounsel = async (
  counselSessionId: string | undefined,
) => {
  if (!counselSessionId) return;
  const response =
    await medicationCounselControllerApi.selectPreviousMedicationCounsel(
      counselSessionId,
    );

  return response.data;
};

export const usePrevMedicationCounsel = (
  counselSessionId: string | undefined,
) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['prevMedicationCounsel', counselSessionId],
    queryFn: () => selectPreviousMedicationCounsel(counselSessionId),
    enabled: !!counselSessionId,
  });

  return {
    prevMedicationCounsel: data?.data,
    isSuccess,
  };
};
