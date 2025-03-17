import { WasteMedicationControllerApi } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const wasteMedicationControllerApi = new WasteMedicationControllerApi();

const deleteWasteMedicationList = async (
  counselSessionId: string,
  wasteMedicationRecordIds: string[],
) => {
  const deletePromises = wasteMedicationRecordIds.map((id) =>
    wasteMedicationControllerApi.deleteWasteMedicationRecord(
      counselSessionId,
      id,
    ),
  );
  const responses = await Promise.all(deletePromises);
  return responses.map((response) => response.data);
};

export const useDeleteMedicationList = () => {
  const queryClient = useQueryClient();

  const deleteWasteMedicationListMutation = useMutation({
    mutationFn: ({
      counselSessionId,
      wasteMedicationRecordIds,
    }: {
      counselSessionId: string;
      wasteMedicationRecordIds: string[];
    }) => deleteWasteMedicationList(counselSessionId, wasteMedicationRecordIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['wasteMedicationList'],
      });
    },
  });

  return { deleteWasteMedicationListMutation };
};
