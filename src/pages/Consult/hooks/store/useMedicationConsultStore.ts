import { MedicationConsultDTO } from '@/pages/Consult/types/MedicineConsultDTO';
import { create } from 'zustand';

interface MedicationConsultState {
  isMedicationConsultInitialized: boolean;
  medicationConsult: MedicationConsultDTO;
  setIsMedicationConsultInitialized: (isInitialized: boolean) => void;
  setMedicationConsult: (medicationConsultDTO: MedicationConsultDTO) => void;
}

export const useMedicationConsultStore = create<MedicationConsultState>(
  (set) => ({
    isMedicationConsultInitialized: false,
    medicationConsult: {
      counselSessionId: '',
      medicationCounselId: '',
      counselRecord: '',
    },

    setIsMedicationConsultInitialized: (isInitialized: boolean) =>
      set({ isMedicationConsultInitialized: isInitialized }),
    setMedicationConsult: (medicationConsultDTO: MedicationConsultDTO) =>
      set({
        medicationConsult: {
          ...medicationConsultDTO,
        },
      }),
  }),
);
