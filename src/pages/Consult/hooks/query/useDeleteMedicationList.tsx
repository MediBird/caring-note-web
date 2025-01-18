import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WasteMedicationControllerApi } from '@/api/api';

const wasteMedicationControllerApi = new WasteMedicationControllerApi();

const deleteMedicationList = async (
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

  const deleteMedicationListMutation = useMutation({
    mutationFn: ({
      counselSessionId,
      wasteMedicationRecordIds,
    }: {
      counselSessionId: string;
      wasteMedicationRecordIds: string[];
    }) => deleteMedicationList(counselSessionId, wasteMedicationRecordIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['wasteMedicationList'],
      });
    },
  });

  return { deleteMedicationListMutation };
};
