import { create } from 'zustand';

export interface WasteMedicationListDTO {
  id: string;
  medicationId: string;
  medicationName: string;
  unit: number;
  disposalReason: string;
}

export const useWasteMedicationListStore = create<{
  wasteMedicationList: WasteMedicationListDTO[];
  setWasteMedicationList: (data: WasteMedicationListDTO[]) => void;
  updateWasteMedicationListById: (
    id: string,
    data: WasteMedicationListDTO,
  ) => void;
}>((set) => ({
  wasteMedicationList: [],
  setWasteMedicationList: (data: WasteMedicationListDTO[]) =>
    set({ wasteMedicationList: data }),
  //특정 id의 폐의약품 목록 업데이트
  updateWasteMedicationListById: (id: string, data: WasteMedicationListDTO) =>
    set((state) => ({
      wasteMedicationList: state.wasteMedicationList.map((item) =>
        item.id === id ? data : item,
      ),
    })),
}));
