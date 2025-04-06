import {
  SelectMedicationRecordListBySessionIdRes,
  WasteMedicationControllerApi,
} from '@/api';
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

export interface WasteMedicationListItem
  extends SelectMedicationRecordListBySessionIdRes {
  id: string;
}

export const useWasteMedicationList = (counselSessionId: string) => {
  const { data, isSuccess, isError } = useQuery<
    SelectMedicationRecordListBySessionIdRes[],
    Error,
    WasteMedicationListItem[]
  >({
    queryKey: ['wasteMedicationList', counselSessionId],
    queryFn: () => selectWasteMedicationList(counselSessionId),
    enabled: !!counselSessionId,

    select: (data: SelectMedicationRecordListBySessionIdRes[]) => {
      return data?.map((item) => ({
        ...item,
        id: item.medicationId,
      }));
    },
  });

  return { data, isSuccess, isError };
};
