import { MedicationConsultDTO } from '@/pages/Consult/types/MedicineConsultDTO';
import { create } from 'zustand';

export const initialMedicationConsultState: MedicationConsultDTO = {
  counselSessionId: '',
  medicationCounselId: '',
  counselRecord: '',
};

interface MedicationConsultState {
  isMedicationConsultInitialized: boolean;
  medicationConsult: MedicationConsultDTO;
  setIsMedicationConsultInitialized: (isInitialized: boolean) => void;
  setMedicationConsult: (medicationConsultDTO: MedicationConsultDTO) => void;
  clearMedicationConsult: () => void;
}

export const useMedicationConsultStore = create<MedicationConsultState>(
  (set) => ({
    isMedicationConsultInitialized: false,
    medicationConsult: initialMedicationConsultState,

    setIsMedicationConsultInitialized: (isInitialized: boolean) =>
      set({ isMedicationConsultInitialized: isInitialized }),
    setMedicationConsult: (medicationConsultDTO: MedicationConsultDTO) =>
      set({
        medicationConsult: medicationConsultDTO,
        isMedicationConsultInitialized: true,
      }),
    clearMedicationConsult: () =>
      set({
        medicationConsult: initialMedicationConsultState,
        isMedicationConsultInitialized: false,
      }),
  }),
);
