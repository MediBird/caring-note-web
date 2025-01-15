import { SelectCounselCardRes } from '@/api';
import { create } from 'zustand';

interface ConsultCardState {
  httpStatus?: number;
  originalData?: SelectCounselCardRes;
  editedData?: SelectCounselCardRes;
  setHttpStatus: (status: number) => void;
  setOriginalData: (data: SelectCounselCardRes) => void;
  setEditedData: (data: SelectCounselCardRes) => void;
  resetEditedData?: () => void;
}

const useConsultCardStore = create<ConsultCardState>((set, get) => ({
  originalData: {},
  editedData: {},
  setHttpStatus: (status: number) => set({ httpStatus: status }),
  setOriginalData: (data: SelectCounselCardRes) =>
    set({ originalData: { ...data } }),
  setEditedData: (data: SelectCounselCardRes) =>
    set({ editedData: { ...data } }),
  resetEditedData: () =>
    set({ editedData: JSON.parse(JSON.stringify(get().originalData)) }),
}));

export default useConsultCardStore;
