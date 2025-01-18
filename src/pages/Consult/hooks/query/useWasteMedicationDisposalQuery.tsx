import { useQuery } from '@tanstack/react-query';
import { WasteMedicationControllerApi } from '@/api/api';

const wasteMedicationControllerApi = new WasteMedicationControllerApi();

const getWasteMedicationDisposal = async (counselSessionId: string) => {
  const response =
    await wasteMedicationControllerApi.getWasteMedicationDisposal(
      counselSessionId,
    );
  return response.data.data?.wasteMedicationDisposal ?? null;
};

export const useWasteMedicationDisposalQuery = (counselSessionId: string) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['wasteMedicationDisposal', counselSessionId],
    queryFn: () => getWasteMedicationDisposal(counselSessionId as string),
    enabled: !!counselSessionId,
  });

  return { data, isSuccess };
};
