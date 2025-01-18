import { WasteMedicationControllerApi } from '@/api/api';
import {
  AddAndUpdateWasteMedicationDisposalSaveDTO,
  WasteMedicationListSaveDTO,
} from '@/types/WasteMedicationDTO';
import { AddAndUpdateWasteMedicationDisposalDTO } from '@/types/WasteMedicationDTO';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const wasteMedicationControllerApi = new WasteMedicationControllerApi();

const saveWasteMedicationList = async (
  wasteMedicationListSaveDTO: WasteMedicationListSaveDTO,
) => {
  console.log(wasteMedicationListSaveDTO);

  const response = await wasteMedicationControllerApi.addWasteMedicationRecord(
    wasteMedicationListSaveDTO.counselSessionId,
    wasteMedicationListSaveDTO.wasteMedicationList,
  );

  return response.data;
};

const saveWasteMedicationDisposal = async (
  counselSessionId: string,
  wasteMedicationDisposal: AddAndUpdateWasteMedicationDisposalDTO,
) => {
  const response =
    await wasteMedicationControllerApi.addWasteMedicationDisposal(
      counselSessionId,
      wasteMedicationDisposal,
    );

  return response.data;
};

export const useWasteMedicationSave = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateWasteMedicationList } = useMutation({
    mutationFn: (wasteMedicationListSaveDTO: WasteMedicationListSaveDTO) => {
      return saveWasteMedicationList(wasteMedicationListSaveDTO);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wasteMedicationList'] });
    },
  });

  const { mutate: mutateWasteMedicationDisposal } = useMutation({
    mutationFn: (
      wasteMedicationDisposalSaveDTO: AddAndUpdateWasteMedicationDisposalSaveDTO,
    ) => {
      return saveWasteMedicationDisposal(
        wasteMedicationDisposalSaveDTO.counselSessionId,
        wasteMedicationDisposalSaveDTO.wasteMedicationDisposal,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wasteMedicationDisposal'] });
    },
  });

  return {
    mutateWasteMedicationList,
    mutateWasteMedicationDisposal,
  };
};
