import {
  AddAndUpdateMedicationRecordHistReqDivisionCodeEnum,
  AddAndUpdateMedicationRecordHistReqUsageStatusCodeEnum,
  MedicationRecordHistControllerApi,
} from '@/api';
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
