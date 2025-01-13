import { create } from "zustand";
import { MedicineConsultDTO } from "@/types/MedicineConsultDTO";

export const useMedicineConsultStore = create<{
    medicineConsult: MedicineConsultDTO;
    setMedicationConsult: (data: MedicineConsultDTO) => void;
    setCounselRecord: (counselRecord: string) => void;
    setCounselRecordHighlights: (counselRecordHighlights: string[]) => void;
  }>((set) => ({
    medicineConsult: {
      counselSessionId: '',
      medicationCounselId: '',
      counselRecord: '',
      counselRecordHighlights: [],
    },
    setMedicationConsult: (data: MedicineConsultDTO) => set({ medicineConsult: data }),
    
    setCounselRecord: (counselRecord: string) =>
      set((state) => ({
        medicineConsult: {
          ...state.medicineConsult,
          counselRecord,
        },
      })),


    setCounselRecordHighlights: (counselRecordHighlights: string[]) =>
      set((state) => ({
        medicineConsult: {
          ...state.medicineConsult,
          counselRecordHighlights, 
        },
      })),
    }));
