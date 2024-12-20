import { GridRowModel, GridRowsProp } from "@mui/x-data-grid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface PrescribedMedicineTableState {
  rows: GridRowsProp;
  selectedRowIds: string[];
}

// Define the initial state using that type
const initialState: PrescribedMedicineTableState = {
  rows: [],
  selectedRowIds: [],
};

export const prescribedMedicineTableState = createSlice({
  name: "prescribedMedicineTable",
  initialState,
  reducers: {
    addRow: (state, action: PayloadAction<GridRowModel>) => {
      state.rows.push({
        ...action.payload,
        id: Math.max(0, ...state.rows.map((row) => Number(row.id))) + 1,
      });
    },
    updateRowById: (state, action: PayloadAction<GridRowModel>) => {
      state.rows = state.rows.map((row) =>
        row.id === action.payload.id ? { ...action.payload } : row,
      );
    },
    deleteRowById: (state, action: PayloadAction<string[]>) => {
      state.rows = [
        ...state.rows.filter(
          (row) => !action.payload.includes(row.id.toString()),
        ),
      ];
    },
    setSelectedRowIds: (state, action: PayloadAction<string[]>) => {
      state.selectedRowIds = action.payload;
    },
  },
});

export const { addRow, updateRowById, deleteRowById, setSelectedRowIds } =
  prescribedMedicineTableState.actions;

export default prescribedMedicineTableState.reducer;
