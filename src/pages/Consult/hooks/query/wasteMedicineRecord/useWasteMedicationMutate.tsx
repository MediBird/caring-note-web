import { WasteMedicationControllerApi } from '@/api';
import {
  AddAndUpdateWasteMedicationDisposalDTO,
  AddAndUpdateWasteMedicationDisposalSaveDTO,
  WasteMedicationListSaveDTO,
} from '@/pages/Consult/types/WasteMedicationDTO';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const wasteMedicationControllerApi = new WasteMedicationControllerApi();

const saveWasteMedicationList = async (
  wasteMedicationListSaveDTO: WasteMedicationListSaveDTO,
) => {
  const response =
    await wasteMedicationControllerApi.addAndUpdateWasteMedicationRecord(
      wasteMedicationListSaveDTO.counselSessionId,
      wasteMedicationListSaveDTO.wasteMedicationList,
    );

  return response.data;
};

const saveWasteMedicationDisposal = async (
  counselSessionId: string,
  wasteMedicationDisposal: AddAndUpdateWasteMedicationDisposalDTO,
) => {
  // 기타를 선택하지 않으면 unusedReasonDetail을 빈 문자열로 설정
  const modifiedDisposal = { ...wasteMedicationDisposal };
  if (!modifiedDisposal.unusedReasonTypes?.includes('ETC')) {
    modifiedDisposal.unusedReasonDetail = '';
  }

  const response =
    await wasteMedicationControllerApi.addWasteMedicationDisposal(
      counselSessionId,
      modifiedDisposal,
    );

  return response.data;
};

export const useWasteMedicationMutate = () => {
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
