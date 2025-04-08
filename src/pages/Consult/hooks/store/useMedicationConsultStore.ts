import { MedicationConsultDTO } from '@/pages/Consult/types/MedicineConsultDTO';
import { Node } from 'slate';
import { create } from 'zustand';

interface MedicationConsultState {
  editorContent: Node[];
  isMedicationConsultInitialized: boolean;
  medicationConsult: MedicationConsultDTO;

  setEditorContent: (content: Node[]) => void;
  setIsMedicationConsultInitialized: (isInitialized: boolean) => void;
  setMedicationConsult: (medicationConsultDTO: MedicationConsultDTO) => void;
}

export const useMedicationConsultStore = create<MedicationConsultState>(
  (set) => ({
    editorContent: [{ type: 'paragraph', children: [{ text: '' }] }],
    isMedicationConsultInitialized: false,
    medicationConsult: {
      counselSessionId: '',
      medicationCounselId: '',
      counselRecord: '',
    },

    setEditorContent: (content: Node[]) => set({ editorContent: content }),
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
