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
  try {
    const response =
      await wasteMedicationControllerApi.addAndUpdateWasteMedicationRecord(
        wasteMedicationListSaveDTO.counselSessionId,
        wasteMedicationListSaveDTO.wasteMedicationList,
      );

    return response.data;
  } catch (error) {
    console.error('폐의약품 기록 저장 중 오류가 발생했습니다:', error);
    throw error;
  }
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

  try {
    const response =
      await wasteMedicationControllerApi.addWasteMedicationDisposal(
        counselSessionId,
        modifiedDisposal,
      );

    return response.data;
  } catch (error) {
    console.error('폐의약품 처리 저장 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export const useWasteMedicationMutate = () => {
  const queryClient = useQueryClient();

  const mutateWasteMedicationList = useMutation({
    mutationFn: (wasteMedicationListSaveDTO: WasteMedicationListSaveDTO) => {
      return saveWasteMedicationList(wasteMedicationListSaveDTO);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wasteMedicationList'] });
    },
  });

  const mutateWasteMedicationDisposal = useMutation({
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
