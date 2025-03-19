import { useWasteMedicationMutate } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationMutate';
import { useWasteMedicationDisposalStore } from '@/pages/Consult/hooks/store/useWasteMedicationDisposalStore';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';

export const useSaveWasteMedication = (counselSessionId: string) => {
  const { mutateWasteMedicationList, mutateWasteMedicationDisposal } =
    useWasteMedicationMutate();

  const { wasteMedicationDisposal } = useWasteMedicationDisposalStore();
  const { wasteMedicationList } = useWasteMedicationListStore();

  const saveWasteMedication = () => {
    mutateWasteMedicationList.mutate({
      counselSessionId,
      wasteMedicationList: wasteMedicationList,
    });
    mutateWasteMedicationDisposal.mutate({
      counselSessionId,
      wasteMedicationDisposal,
    });
  };

  // 두 mutate가 모두 성공했는지 확인하는 통합 플래그
  const isSuccessWasteMedication =
    mutateWasteMedicationList.isSuccess &&
    mutateWasteMedicationDisposal.isSuccess;

  return {
    saveWasteMedication,
    isSuccessWasteMedication,
  };
};
