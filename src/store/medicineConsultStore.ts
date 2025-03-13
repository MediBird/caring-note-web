import { create } from 'zustand';
import {
  CounselRecordHighlights,
  MedicineConsultDTO,
} from '@/types/MedicineConsultDTO';

interface MedicineConsultState {
  medicineConsult: MedicineConsultDTO;
  setMedicationConsult: (data: MedicineConsultDTO) => void;
  setCounselRecord: (counselRecord: string) => void;
  setCounselRecordHighlights: (
    counselRecordHighlights: CounselRecordHighlights[],
  ) => void;
  isEditorInitialized: boolean;
  setEditorInitialized: (initialized: boolean) => void;
}

export const useMedicineConsultStore = create<MedicineConsultState>((set) => ({
  medicineConsult: {
    counselSessionId: '',
    medicationCounselId: '',
    counselRecord: '',
    counselRecordHighlights: [],
  },
  setMedicationConsult: (data: MedicineConsultDTO) =>
    set({ medicineConsult: data }),

  setCounselRecord: (counselRecord: string) =>
    set((state) => ({
      medicineConsult: {
        ...state.medicineConsult,
        counselRecord,
      },
    })),

  setCounselRecordHighlights: (
    counselRecordHighlights: CounselRecordHighlights[],
  ) =>
    set((state) => ({
      medicineConsult: {
        ...state.medicineConsult,
        counselRecordHighlights,
      },
    })),

  isEditorInitialized: false,
  setEditorInitialized: (initialized) =>
    set({ isEditorInitialized: initialized }),
}));
