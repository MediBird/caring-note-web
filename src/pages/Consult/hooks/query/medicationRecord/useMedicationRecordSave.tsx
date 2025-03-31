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

  const response =
    await medicationRecordHistControllerApi.addAndUpdateMedicationRecordHist(
      counselSessionId,
      medicationRecordHistListPayload,
    );
  return response.data;
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
