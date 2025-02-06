import { useWasteMedicationSave } from '@/pages/Consult/hooks/query/useWasteMedicationSave';
import { useWasteMedicationDisposalStore } from '@/pages/Consult/hooks/store/useWasteMedicationDisposalStore';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';

export const useSaveWasteMedication = (counselSessionId: string) => {
  const { mutateWasteMedicationList, mutateWasteMedicationDisposal } =
    useWasteMedicationSave();

  const { wasteMedicationDisposal } = useWasteMedicationDisposalStore();
  const { wasteMedicationList } = useWasteMedicationListStore();

  //wasteMedicationList에서 id필드를 제거
  const wasteMedicationListWithoutId = wasteMedicationList.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ id, ...rest }) => rest,
  );

  const saveWasteMedication = () => {
    mutateWasteMedicationList({
      counselSessionId,
      wasteMedicationList: wasteMedicationListWithoutId,
    });
    mutateWasteMedicationDisposal({
      counselSessionId,
      wasteMedicationDisposal,
    });
  };

  return {
    saveWasteMedication,
  };
};
