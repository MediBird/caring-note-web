import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowSelectionModel,
  GridRowsProp,
} from "@mui/x-data-grid";
import { on } from "events";
import React from "react";

type TableComponentProps = {
  rows: GridRowsProp;
  columns: GridColDef[];
  onUpdateCell: (update: GridRowModel) => void;
  onRowSelectionModelChange?: (selection: string[]) => void;
};

const TableComponent: React.FC<TableComponentProps> = ({
  rows,
  columns,
  onUpdateCell,
  onRowSelectionModelChange,
}) => {
  const memoizedRows = React.useMemo(() => rows, [rows]);
  const memoizedColumns = React.useMemo(() => columns, [columns]);

  return (
    <div>
      <DataGrid
        key={"prescribedMedicineTable"}
        className="!rounded-xl"
        classes={{
          columnHeader: "bg-blue-200",
          cell: "bg-white",
        }}
        rows={memoizedRows}
        columns={memoizedColumns}
        checkboxSelection // 체크박스 추가
        disableRowSelectionOnClick // cell 클릭시 row 선택 안되도록
        processRowUpdate={(update) => {
          onUpdateCell(update);
          return update;
        }}
        onProcessRowUpdateError={(error) => {
          console.error(error);
        }}
        onRowSelectionModelChange={(selection: GridRowSelectionModel) => {
          onRowSelectionModelChange?.(selection.map((s) => s.toString()));
        }}
        disableColumnMenu
        hideFooter
      />
    </div>
  );
};

export default TableComponent;
