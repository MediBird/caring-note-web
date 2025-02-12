import { ColumnDef } from '@tanstack/react-table';
import { WasteMedicationListDTO } from '@/types/WasteMedicationDTO';
import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TextInputCell from '@/components/common/DataTable/TextInputCell';
import SelectCellWithCustomInput from '@/components/common/DataTable/SelectCellWithCustomInput';
import MedicineSearchCell from '@/components/common/DataTable/MedicineSearchCell';

export const defaultColumnSizing = {
  size: 400,
  minSize: 50,
  maxSize: Number.MAX_SAFE_INTEGER,
};

interface WasteMedicationColumnsProps {
  onDelete: (id: string) => void;
  handleUpdateCell: (id: string, field: string, value: string) => void;
  handleSearchEnter: (
    id: string,
    medicationId: string,
    medicationName: string,
  ) => void;
}

export const createColumns = ({
  onDelete,
  handleUpdateCell,
  handleSearchEnter,
}: WasteMedicationColumnsProps): ColumnDef<WasteMedicationListDTO>[] => [
  {
    id: 'medicationName',
    accessorKey: 'medicationName',
    header: '성분명 / 상품명',
    size: 428,
    cell: ({ row }) => {
      return (
        <MedicineSearchCell
          row={row}
          value={row.original.medicationName}
          handleSearchEnter={handleSearchEnter}
        />
      );
    },
  },
  {
    id: 'unit',
    accessorKey: 'unit',
    header: '제품 단위',
    enableResizing: false,
    size: 144,
    cell: ({ row }) => {
      return (
        <TextInputCell
          value={row.original.unit}
          row={row}
          unit={'g'}
          field={'unit'}
          handleUpdateCell={handleUpdateCell}
        />
      );
    },
  },
  {
    id: 'disposalReason',
    accessorKey: 'disposalReason',
    header: '폐기 원인',
    size: 428,
    cell: ({ row }) => {
      return (
        <SelectCellWithCustomInput
          initialValue={row.original.disposalReason}
          options={DISPOSAL_REASON_OPTIONS}
          placeholder="폐기 원인을 선택하세요"
          onValueChange={(value) => {
            handleUpdateCell(row.original.id, 'disposalReason', value);
          }}
        />
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-end items-center">
              <button className="hover:bg-grayscale-5 text-center content-center rounded-[4px] text-grayscale-60 p-1">
                <Ellipsis className="w-4 h-4" />
              </button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                onDelete(row.original.id);
              }}>
              삭제하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 30,
  },
];

const DISPOSAL_REASON_OPTIONS = [
  {
    label: '증상호전 및 본인 판단에 의한 복용 중단',
    value: '증상호전 및 본인 판단에 의한 복용 중단',
  },
  {
    label: '처방의사의 처방 변경으로 인한 복용중단',
    value: '처방의사의 처방 변경으로 인한 복용중단',
  },
  {
    label: '사용기한 초과로 인한 폐기',
    value: '사용기한 초과로 인한 폐기',
  },
  {
    label: '사용기한이 남아있으나 오염 및 변질로 인한 폐기',
    value: '사용기한이 남아있으나 오염 및 변질로 인한 폐기',
  },
  {
    label: '약물 부작용으로 인한 복용 중단',
    value: '약물 부작용으로 인한 복용 중단',
  },
];
