import { MedicationRecordHistControllerApi } from '@/api';
import { MedicationRecordListSaveDTO } from '@/pages/Consult/types/MedicationRecordListDTO';
import useMedicineMemoStore from '@/store/medicineMemoStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const medicationRecordHistControllerApi =
  new MedicationRecordHistControllerApi();

const saveMedicationRecord = async ({
  counselSessionId,
  medicationRecordHistList,
}: MedicationRecordListSaveDTO) => {
  const medicationRecordHistListPayload = medicationRecordHistList.map(
    (item) => ({
      rowId: item.rowId === '' ? undefined : item.rowId,
      medicationId: item.medicationId || '',
      divisionCode: item.divisionCode || 'PRESCRIPTION',
      prescriptionDate: item.prescriptionDate || undefined,
      prescriptionDays: item.prescriptionDays
        ? Number(item.prescriptionDays)
        : undefined,
      medicationName: item.medicationName as string,
      usageObject: item.usageObject || undefined,
      unit: '일',
      usageStatusCode: item.usageStatusCode || 'REGULAR',
    }),
  );

  try {
    const response =
      await medicationRecordHistControllerApi.addAndUpdateMedicationRecordHist(
        counselSessionId,
        medicationRecordHistListPayload,
      );
    return response.data;
  } catch (error) {
    console.error('약물 기록 저장 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export const useMedicationRecordSave = ({
  counselSessionId,
}: {
  counselSessionId: string;
}) => {
  const queryClient = useQueryClient();

  const { medicationRecordList } = useMedicineMemoStore();

  return useMutation({
    mutationFn: () =>
      saveMedicationRecord({
        counselSessionId,
        medicationRecordHistList: medicationRecordList,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationRecordList'] });
    },
  });
};
