import PlusBlueIcon from '@/assets/icon/24/add.outlined.blue.svg?react'; // TODO : Figma에 Blue 아이콘 추가되면 해당 파일로 교체 필요
import { cn } from '@/lib/utils';
import {
  DataGrid,
  GridCallbackDetails,
  GridCellParams,
  gridClasses,
  GridColDef,
  GridRowModel,
  GridRowSelectionModel,
  GridRowsProp,
  MuiEvent,
} from '@mui/x-data-grid';
import React from 'react';

type TableComponentProps = {
  tableKey: string;
  rows: GridRowsProp;
  columns: GridColDef[];
  checkboxSelection?: boolean;
  onUpdateCell?: (update: GridRowModel) => void;
  onRowSelectionModelChange?: (selection: string[]) => void;
  withAddButton?: boolean;
  onClickAddButton?: () => void;
  onCellClick?: (
    params: GridCellParams,
    event: MuiEvent<React.MouseEvent<HTMLElement>>,
    details: GridCallbackDetails,
  ) => void;
};

const TableComponent: React.FC<TableComponentProps> = ({
  tableKey,
  rows,
  columns,
  checkboxSelection = false,
  onUpdateCell,
  onRowSelectionModelChange,
  withAddButton,
  onClickAddButton,
  onCellClick,
}) => {
  const memoizedRows = React.useMemo(() => rows, [rows]);
  const memoizedColumns = React.useMemo(() => columns, [columns]);

  return (
    <div>
      <DataGrid
        key={tableKey}
        onCellClick={(params, event, details) => {
          if (onCellClick) {
            onCellClick(params, event, details);
          }
        }}
        className={cn(
          'bg-transparent',
          withAddButton ? '!rounded-t-xl' : '!rounded-xl',
        )}
        classes={{
          columnHeader: 'bg-gray-200',
          cell: 'border-none',
          row: 'hover:!bg-primary-5 bg-white',
        }}
        sx={{
          [`& .${gridClasses.cell}--editing`]: {
            borderRadius: '8px !important',
            outline: 'none !important',
            padding: '4px !important',
            zIndex: '1000 !important',
          },
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
            {
              outline: 'none',
            },
          [`& .MuiDataGrid-cell[data-editing="true"]:focus, & .MuiDataGrid-cell[data-editing="true"]:focus-within`]:
            {
              outline: 'none !important', // 편집 모드 셀 포커스 보더 제거
              padding: '0px !important',
            },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
            {
              outline: 'none',
            },
        }}
        rows={memoizedRows}
        columns={memoizedColumns}
        checkboxSelection={checkboxSelection} // 체크박스 추가
        disableRowSelectionOnClick // cell 클릭시 row 선택 안되도록
        processRowUpdate={(update) => {
          onUpdateCell?.(update);
          return update;
        }}
        onProcessRowUpdateError={(error) => {
          console.error(error);
        }}
        onRowSelectionModelChange={(selection: GridRowSelectionModel) => {
          onRowSelectionModelChange?.(selection.map((s) => s.toString()));
        }}
        // disableColumnMenu  // 24.12.29 : 기디쪽 기능 확인을 위해 컬럼 기능 사용
        hideFooter
        slots={{
          noRowsOverlay: () => (
            <div className="flex items-center justify-center w-full h-full bg-white">
              <span className="text-gray-400">항목이 존재하지 않습니다</span>
            </div>
          ),
          columnMenu: () => null,
          columnMenuIcon: () => null,
        }}
      />
      {withAddButton ? (
        <div
          className="flex items-center rounded-b-xl bg-white border-x border-b border-grayscale-10 p-3 hover:cursor-pointer"
          onClick={onClickAddButton}>
          <PlusBlueIcon
            className="inline-block"
            width={24}
            height={24}></PlusBlueIcon>
          <span className="text-body1 text-primary-50 ml-2">
            새 의약품 추가하기
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default TableComponent;
