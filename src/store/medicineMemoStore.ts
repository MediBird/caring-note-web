import {
  AddAndUpdateMedicationRecordHistReq,
  SelectMedicationRecordHistRes,
} from "@/api";
import { create } from "zustand";

interface MedicineMemoState {
  httpStatus?: number;
  originalData?: SelectMedicationRecordHistRes[];
  editedData?: AddAndUpdateMedicationRecordHistReq[];
  setHttpStatus?: (status: number) => void;
  setOriginalData?: (data: SelectMedicationRecordHistRes[]) => void;
  setEditedData?: (data: AddAndUpdateMedicationRecordHistReq[]) => void;
  resetEditedData?: () => void;
}

const useMedicineMemoStore = create<MedicineMemoState>((set, get) => ({
  originalData: [],
  editedData: [],
  setHttpStatus: (status: number) => set({ httpStatus: status }),
  setOriginalData: (data: SelectMedicationRecordHistRes[]) =>
    set({ originalData: [...data] }),
  setEditedData: (data: AddAndUpdateMedicationRecordHistReq[]) =>
    set({ editedData: [...data] }),
  resetEditedData: () =>
    set({ editedData: JSON.parse(JSON.stringify(get().originalData)) }),
}));

export default useMedicineMemoStore;
