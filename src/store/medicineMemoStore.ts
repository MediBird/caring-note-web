import { MedicationRecordListDTO } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordList';
import { create } from 'zustand';

interface MedicineMemoState {
  medicationRecordList: MedicationRecordListDTO[];
  isListInitialized: boolean;
  setMedicationRecordList: (data: MedicationRecordListDTO[]) => void;
  updateMedicationRecordListById: (
    id: string,
    data: MedicationRecordListDTO,
  ) => void;
  setIsListInitialized: (isInitialized: boolean) => void;
  clearMedicationRecords: () => void;
}

const useMedicineMemoStore = create<MedicineMemoState>((set) => ({
  medicationRecordList: [],
  isListInitialized: false,
  setMedicationRecordList: (data: MedicationRecordListDTO[]) =>
    set({ medicationRecordList: [...data], isListInitialized: true }),
  updateMedicationRecordListById: (id: string, data: MedicationRecordListDTO) =>
    set((state) => ({
      medicationRecordList: state.medicationRecordList.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      ),
    })),
  setIsListInitialized: (isInitialized: boolean) =>
    set({ isListInitialized: isInitialized }),
  clearMedicationRecords: () =>
    set({ medicationRecordList: [], isListInitialized: false }),
}));

export default useMedicineMemoStore;
