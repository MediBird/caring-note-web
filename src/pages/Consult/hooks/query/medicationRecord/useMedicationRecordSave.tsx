import {
  AddAndUpdateMedicationRecordHistReqDivisionCodeEnum,
  AddAndUpdateMedicationRecordHistReqUsageStatusCodeEnum,
  MedicationRecordHistControllerApi,
} from '@/api/api';
import { MedicationRecordListSaveDTO } from '@/pages/Consult/types/MedicationRecordListDTO';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const medicationRecordHistControllerApi =
  new MedicationRecordHistControllerApi();

const saveMedicationRecord = async ({
  counselSessionId,
  medicationRecordHistList,
}: MedicationRecordListSaveDTO) => {
  const medicationRecordHistListPayload = medicationRecordHistList.map(
    (item) => ({
      rowId: item.rowId === '' ? (null as unknown as string) : item.rowId,
      medicationId: item.medicationId as string,
      divisionCode:
        item.divisionCode as AddAndUpdateMedicationRecordHistReqDivisionCodeEnum,
      prescriptionDate: item.prescriptionDate as string,
      prescriptionDays: Number(item.prescriptionDays),
      medicationName: item.medicationName as string,
      usageObject: item.usageObject as string,
      unit: '일',
      usageStatusCode:
        item.usageStatusCode as AddAndUpdateMedicationRecordHistReqUsageStatusCodeEnum,
    }),
  );

  const response =
    await medicationRecordHistControllerApi.addAndUpdateMedicationRecordHist(
      counselSessionId,
      medicationRecordHistListPayload,
    );
  return response.data;
};

export const useMedicationRecordSave = () => {
  const queryClient = useQueryClient();

  const { mutate: saveMedicationRecordList } = useMutation({
    mutationFn: (data: MedicationRecordListSaveDTO) =>
      saveMedicationRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationRecordList'] });
    },
  });

  return { saveMedicationRecordList };
};
