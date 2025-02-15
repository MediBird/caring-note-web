import { useWasteMedicationMutate } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationMutate';
import { useWasteMedicationDisposalStore } from '@/pages/Consult/hooks/store/useWasteMedicationDisposalStore';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';

export const useSaveWasteMedication = (counselSessionId: string) => {
  const { mutateWasteMedicationList, mutateWasteMedicationDisposal } =
    useWasteMedicationMutate();

  const { wasteMedicationDisposal } = useWasteMedicationDisposalStore();
  const { wasteMedicationList } = useWasteMedicationListStore();

  // export interface WasteMedicationListDTO {
  //   id: string;
  //   rowId?: string;
  //   medicationId: string;
  //   medicationName: string;
  //   unit: number;
  //   disposalReason: string;
  // }

  const saveWasteMedication = () => {
    mutateWasteMedicationList({
      counselSessionId,
      wasteMedicationList: wasteMedicationList,
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
