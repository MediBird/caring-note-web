import { GridRowModel, GridRowsProp } from '@mui/x-data-grid';
import { create } from 'zustand';

interface MedicineTableState {
  normalMedicineRows: GridRowsProp;
  selectedNormalMedicineRowIds: string[];
  addNormalMedicineRow: (row: GridRowModel) => void;
  updateNormalMedicineRowById: (row: GridRowModel) => void;
  deleteNormalMedicineRowById: (ids: string[]) => void;
  setSelectedNormalMedicineRowIds: (ids: string[]) => void;
}

const useNomalMedicineTableStore = create<MedicineTableState>((set) => ({
  normalMedicineRows: [],
  selectedNormalMedicineRowIds: [],
  addNormalMedicineRow: (row) =>
    set((state) => ({
      normalMedicineRows: [
        ...state.normalMedicineRows,
        {
          ...row,
          id:
            row?.id ||
            Math.max(
              0,
              ...state.normalMedicineRows.map((row) => Number(row.id)),
            ) + 1,
        },
      ],
    })),
  updateNormalMedicineRowById: (row) =>
    set((state) => ({
      normalMedicineRows: state.normalMedicineRows.map((r) =>
        r.id === row.id ? { ...row } : r,
      ),
    })),
  deleteNormalMedicineRowById: (ids) =>
    set((state) => ({
      normalMedicineRows: state.normalMedicineRows.filter(
        (row) => !ids.includes(row.id.toString()),
      ),
    })),
  setSelectedNormalMedicineRowIds: (ids) =>
    set(() => ({
      selectedNormalMedicineRowIds: ids,
    })),
}));

export default useNomalMedicineTableStore;
