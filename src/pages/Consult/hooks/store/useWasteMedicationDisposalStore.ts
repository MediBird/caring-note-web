import { AddAndUpdateWasteMedicationDisposalDTO } from '@/pages/Consult/types/WasteMedicationDTO';
import { create } from 'zustand';

export const initialWasteMedicationDisposalState: AddAndUpdateWasteMedicationDisposalDTO =
  {
    unusedReasonTypes: [],
    unusedReasonDetail: '',
    drugRemainActionType: undefined,
    drugRemainActionDetail: '',
    recoveryAgreementType: undefined,
    wasteMedicationGram: 0,
  };

export const useWasteMedicationDisposalStore = create<{
  wasteMedicationDisposal: AddAndUpdateWasteMedicationDisposalDTO;
  setWasteMedicationDisposal: (
    data: AddAndUpdateWasteMedicationDisposalDTO,
  ) => void;
  isDisposalInitialized: boolean;
  setIsDisposalInitialized: (initialized: boolean) => void;
}>((set) => ({
  wasteMedicationDisposal: initialWasteMedicationDisposalState,
  setWasteMedicationDisposal: (data: AddAndUpdateWasteMedicationDisposalDTO) =>
    set({ wasteMedicationDisposal: data }),
  isDisposalInitialized: false,
  setIsDisposalInitialized: (initialized) =>
    set({ isDisposalInitialized: initialized }),
}));
