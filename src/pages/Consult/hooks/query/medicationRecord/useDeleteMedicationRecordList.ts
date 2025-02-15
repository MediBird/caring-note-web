import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MedicationRecordHistControllerApi } from '@/api/api';

const medicationRecordHistControllerApi =
  new MedicationRecordHistControllerApi();

const deleteMedicationRecordList = async (
  id: string,
  counselSessionId: string,
) => {
  const response =
    await medicationRecordHistControllerApi.deleteMedicationRecordHist(
      counselSessionId,
      id,
    );

  return response.data;
};

export const useDeleteMedicationRecordList = () => {
  const queryClient = useQueryClient();

  const deleteMedicationRecordListMutation = useMutation({
    mutationFn: ({
      id,
      counselSessionId,
    }: {
      id: string;
      counselSessionId: string;
    }) => deleteMedicationRecordList(id, counselSessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medicationRecordList'],
      });
    },
  });

  return { deleteMedicationRecordListMutation };
};
