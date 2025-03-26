import { WasteMedicationControllerApi } from '@/api';
import { useQuery } from '@tanstack/react-query';

export interface AddAndUpdateWasteMedicationDisposalDTO {
  rowId?: string;
  medicationId?: string;
  unit: number;
  disposalReason: string;
  medicationName: string;
}

const wasteMedicationControllerApi = new WasteMedicationControllerApi();

const selectWasteMedicationList = async (counselSessionId: string) => {
  const response =
    await wasteMedicationControllerApi.selectMedicationRecordListBySessionId(
      counselSessionId,
    );

  return response.data.data ?? [];
};

export const useWasteMedicationList = (counselSessionId: string) => {
  const { data, isSuccess, isError } = useQuery({
    queryKey: ['wasteMedicationList', counselSessionId],
    queryFn: () => selectWasteMedicationList(counselSessionId),
    enabled: !!counselSessionId,
    //add id to array item for material-ui table
    select: (data) => {
      return data?.map((item) => ({
        ...item,
        id: item.medicationId,
      }));
    },
  });

  return { data, isSuccess, isError };
};
