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

interface WasteMedicationDisposalState {
  wasteMedicationDisposal: AddAndUpdateWasteMedicationDisposalDTO;
  setWasteMedicationDisposal: (
    data: AddAndUpdateWasteMedicationDisposalDTO,
  ) => void;
  isDisposalInitialized: boolean;
  setIsDisposalInitialized: (initialized: boolean) => void;
  clearWasteMedicationDisposal: () => void;
}

export const useWasteMedicationDisposalStore =
  create<WasteMedicationDisposalState>((set) => ({
    wasteMedicationDisposal: initialWasteMedicationDisposalState,
    setWasteMedicationDisposal: (
      data: AddAndUpdateWasteMedicationDisposalDTO,
    ) => set({ wasteMedicationDisposal: data, isDisposalInitialized: true }),
    isDisposalInitialized: false,
    setIsDisposalInitialized: (initialized) =>
      set({ isDisposalInitialized: initialized }),
    clearWasteMedicationDisposal: () =>
      set({
        wasteMedicationDisposal: initialWasteMedicationDisposalState,
        isDisposalInitialized: false,
      }),
  }));
