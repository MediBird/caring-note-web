import { SelectMedicationRecordHistRes } from '@/api';
import { WasteMedicationListDTO } from '@/pages/Consult/types/WasteMedicationDTO';

import { create } from 'zustand';

export const useWasteMedicationListStore = create<{
  wasteMedicationList: WasteMedicationListDTO[];
  setWasteMedicationList: (data: WasteMedicationListDTO[]) => void;
  updateWasteMedicationListById: (
    id: string,
    data: WasteMedicationListDTO,
  ) => void;
  isWasteListInitialized: boolean;
  setIsWasteListInitialized: (initialized: boolean) => void;
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
  isWasteListInitialized: false,
  setIsWasteListInitialized: (initialized) =>
    set({ isWasteListInitialized: initialized }),
}));

export const initSelectMedicationRecordHistRes: SelectMedicationRecordHistRes =
  {
    rowId: '',
    medicationId: '',
    medicationName: '',
    divisionCode: 'PRESCRIPTION',
    usageObject: '',
    prescriptionDate: undefined,
    prescriptionDays: 0,
    unit: '일',
    usageStatusCode: undefined,
    updatedDatetime: new Date().toISOString().split('T')[0],
    createdDatetime: new Date().toISOString().split('T')[0],
    createdBy: '',
    updatedBy: '',
  };
