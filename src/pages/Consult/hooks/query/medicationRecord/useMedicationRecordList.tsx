import {
  MedicationRecordHistControllerApi,
  SelectMedicationRecordHistRes,
} from '@/api';
import { useQuery } from '@tanstack/react-query';

export type MedicationRecordListDTO = SelectMedicationRecordHistRes & {
  id: string;
};

const medicationRecordHistControllerApi =
  new MedicationRecordHistControllerApi();

//처방 의약품 목록 조회 쿼리
const selectMedicationRecordListBySessionId = async ({
  counselSessionId,
}: {
  counselSessionId: string;
}) => {
  if (!counselSessionId) return;
  const response =
    await medicationRecordHistControllerApi.selectMedicationRecordListBySessionId1(
      counselSessionId,
    );
  return response.data.data ?? [];
};

export const useMedicationRecordList = ({
  counselSessionId,
}: {
  counselSessionId: string;
}) => {
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['medicationRecordList', counselSessionId],
    queryFn: () => selectMedicationRecordListBySessionId({ counselSessionId }),
    enabled: !!counselSessionId,
    select: (data) => {
      return data?.map((item) => ({
        ...item,
        id: item.rowId as string,
      }));
    },
  });

  return { data, isLoading, isSuccess, isError };
};
