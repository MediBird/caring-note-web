import { useWasteMedicationMutate } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationMutate';
import { useWasteMedicationDisposalStore } from '@/pages/Consult/hooks/store/useWasteMedicationDisposalStore';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';

export const useSaveWasteMedication = (counselSessionId: string) => {
  const { mutateWasteMedicationList, mutateWasteMedicationDisposal } =
    useWasteMedicationMutate();

  const { wasteMedicationDisposal } = useWasteMedicationDisposalStore();
  const { wasteMedicationList } = useWasteMedicationListStore();

  const saveWasteMedication = async () => {
    try {
      await Promise.all([
        mutateWasteMedicationList.mutateAsync({
          counselSessionId,
          wasteMedicationList: wasteMedicationList,
        }),
        mutateWasteMedicationDisposal.mutateAsync({
          counselSessionId,
          wasteMedicationDisposal,
        }),
      ]);
    } catch (error) {
      console.error('폐의약품 기록 저장 중 오류가 발생했습니다:', error);
      throw error;
    }
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
