import { SelectMedicationRecordHistRes } from '@/api/api';
import { WasteMedicationListDTO } from '@/pages/Consult/types/WasteMedicationDTO';
import { create } from 'zustand';

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

export const initSelectMedicationRecordHistRes: SelectMedicationRecordHistRes =
  {
    rowId: '',
    medicationId: '',
    medicationName: '',
    divisionCode: 'PRESCRIPTION',
    usageObject: '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    prescriptionDays: 0,
    unit: '일',
    usageStatusCode: undefined,
    updatedDatetime: new Date().toISOString().split('T')[0],
    createdDatetime: new Date().toISOString().split('T')[0],
    createdBy: '',
    updatedBy: '',
  };
