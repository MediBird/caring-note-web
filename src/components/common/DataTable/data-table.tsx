import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/getTableCellPinningStyle';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  footer?: React.ReactNode;
  sorting?: SortingState;
  SortingFns?: Record<string, SortingFn<TData>>;
  minWidth?: number;
  onRowClick?: (rowData: TData) => void;
  highlightedRowId?: string | null;
  idField?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  footer,
  sorting: initialSorting,
  minWidth = 1020,
  SortingFns,
  onRowClick,
  highlightedRowId,
  idField = 'counselSessionId',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting || []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      columnPinning: { right: ['actions'] },
    },

    sortingFns: SortingFns ?? {},
  });

  const handleRowClick = (rowData: TData) => {
    if (onRowClick) {
      onRowClick(rowData);
    }
  };

  return (
    <div className="border-1 w-full overflow-hidden rounded-[12px] border border-grayscale-10 bg-white">
      <Table
        style={{
          width: '100%',
          minWidth: minWidth,
        }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                return (
                  <TableHead
                    key={header.id + index}
                    style={{
                      width: header.column.columnDef.size,
                      ...getCommonPinningStyles({
                        column: header.column,
                      }),
                    }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rowData = row.original as any;

              return (
                <TableRow
                  key={row.id + index}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => handleRowClick(row.original)}
                  className={cn(
                    'group transition-colors duration-300 ease-in-out hover:!bg-primary-5',
                    highlightedRowId &&
                      idField in rowData &&
                      highlightedRowId === rowData[idField]
                      ? '!bg-secondary-5 [&_td]:bg-secondary-5'
                      : '',
                    onRowClick ? `cursor-pointer` : '',
                  )}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.columnDef.size,
                        ...getCommonPinningStyles({
                          column: cell.column,
                        }),
                      }}
                      className="transition-colors duration-200 ease-in-out group-hover:!bg-primary-5"
                      onClick={(e) => {
                        // actions 칼럼일 경우 row 클릭 이벤트 전파 방지
                        if (cell.column.id === 'actions') {
                          e.stopPropagation();
                        }
                      }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-12 text-center text-sm text-grayscale-30">
                기록 내역이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {footer && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>{footer}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
