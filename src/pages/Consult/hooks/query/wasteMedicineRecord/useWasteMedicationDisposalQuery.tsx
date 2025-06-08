import { WasteMedicationControllerApi } from '@/api';
import { useQuery } from '@tanstack/react-query';

const wasteMedicationControllerApi = new WasteMedicationControllerApi();

const getWasteMedicationDisposal = async (counselSessionId: string) => {
  const response =
    await wasteMedicationControllerApi.getWasteMedicationDisposal(
      counselSessionId,
    );
  return response.data.data?.wasteMedicationDisposal ?? null;
};

export const useWasteMedicationDisposalQuery = (counselSessionId: string) => {
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['wasteMedicationDisposal', counselSessionId],
    queryFn: () => getWasteMedicationDisposal(counselSessionId as string),
    enabled: !!counselSessionId,
  });

  return { data, isLoading, isSuccess, isError };
};
