import { GridRowModel, GridRowsProp } from '@mui/x-data-grid';
import { create } from 'zustand';

interface PrescribedMedicineTableState {
  prescribedMedicineRows: GridRowsProp;
  selectedPrescribedMedicineRowIds: string[];
  addPrescribedMedicineRow: (row: GridRowModel) => void;
  updatePrescribedMedicineRowById: (row: GridRowModel) => void;
  deletePrescribedMedicineRowById: (ids: string[]) => void;
  setSelectedPrescribedMedicineRowIds: (ids: string[]) => void;
}

const usePrescribedMedicineTableStore = create<PrescribedMedicineTableState>(
  (set) => ({
    prescribedMedicineRows: [],
    selectedPrescribedMedicineRowIds: [],
    addPrescribedMedicineRow: (row) =>
      set((state) => ({
        prescribedMedicineRows: [
          ...state.prescribedMedicineRows,
          {
            ...row,
            id:
              row?.id ||
              Math.max(
                0,
                ...state.prescribedMedicineRows.map((row) => Number(row.id)),
              ) + 1,
          },
        ],
      })),
    updatePrescribedMedicineRowById: (row) =>
      set((state) => ({
        prescribedMedicineRows: state.prescribedMedicineRows.map((r) =>
          r.id === row.id ? { ...row } : r,
        ),
      })),
    deletePrescribedMedicineRowById: (ids) =>
      set((state) => ({
        prescribedMedicineRows: state.prescribedMedicineRows.filter(
          (row) => !ids.includes(row.id.toString()),
        ),
      })),
    setSelectedPrescribedMedicineRowIds: (ids) =>
      set(() => ({
        selectedPrescribedMedicineRowIds: ids,
      })),
  }),
);

export default usePrescribedMedicineTableStore;
