import { create } from 'zustand';
import { Node } from 'slate';
import { MedicationConsultDTO } from '@/pages/Consult/types/MedicineConsultDTO';

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
      counselRecordHighlights: [],
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
