import MedicineSearchCell from '@/components/common/DataTable/medicine-search-cell';
import SelectCell from '@/components/common/DataTable/select-cell';
import TextInputCell from '@/components/common/DataTable/text-input-cell';
import DatePickerComponent from '@/components/ui/datepicker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MedicationRecordListDTO } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordList';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';

interface PrescriptionMedicineTableColumnsProps {
  onDelete: (id: string) => void;
  handleUpdateCell: (id: string, field: string, value: string | number) => void;
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
}: PrescriptionMedicineTableColumnsProps): ColumnDef<MedicationRecordListDTO>[] => [
  {
    id: 'usageStatusCode',
    header: '사용 상태',
    accessorKey: 'usageStatusCode',
    cell: ({ row }) => {
      const selectedOption = USAGE_STATUS_CODE_OPTIONS.find(
        (option) => option.value === row.original.usageStatusCode,
      );

      return (
        <SelectCell
          initialValue={selectedOption?.value ?? ''}
          options={USAGE_STATUS_CODE_OPTIONS}
          placeholder="사용 상태를 선택하세요"
          onValueChange={(value) => {
            console.log(value);
            handleUpdateCell(
              row.original.id as string,
              'usageStatusCode',
              value,
            );
          }}
        />
      );
    },
  },
  {
    id: 'medicationName',
    header: '성분명 / 상품명',
    accessorKey: 'medicationName',
    cell: ({ row }) => {
      return (
        <MedicineSearchCell
          row={row}
          value={row.original.medicationName as string}
          handleSearchEnter={handleSearchEnter}
        />
      );
    },
  },
  {
    id: 'usageObject',
    header: '약물 사용 목적',
    accessorKey: 'usageObject',
    cell: ({ row }) => {
      return (
        <TextInputCell
          value={row.original.usageObject as unknown as string}
          field="usageObject"
          row={row}
          handleUpdateCell={handleUpdateCell}
          placeholder="사용 목적"
        />
      );
    },
  },
  {
    id: 'prescriptionDate',
    header: '처방 날짜',
    accessorKey: 'prescriptionDate',
    cell: ({ row }) => {
      const initialDate = new Date(row.original.prescriptionDate ?? '');
      return (
        <DatePickerComponent
          initialDate={initialDate}
          handleClicked={(value) => {
            if (!value) return;

            const dateString = value.toISOString();
            const formattedDate = dateString.split('T')[0];

            handleUpdateCell(
              row.original.rowId as string,
              'prescriptionDate',
              formattedDate,
            );
          }}
        />
      );
    },
  },
  {
    id: 'prescriptionDays',
    header: '처방 일수',
    accessorKey: 'prescriptionDays',
    size: 100,
    cell: ({ row }) => {
      return (
        <TextInputCell
          value={row.original.prescriptionDays as unknown as string}
          field="prescriptionDays"
          row={row}
          handleUpdateCell={handleUpdateCell}
          unit={'일'}
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
            <div className="flex justify-center items-center w-full">
              <button className="hover:bg-grayscale-5 text-center content-center rounded-[4px] text-grayscale-60 p-1">
                <Ellipsis className="w-4 h-4" />
              </button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                onDelete(row.original.id as string);
              }}>
              삭제하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 20,
  },
];

const USAGE_STATUS_CODE_OPTIONS = [
  { label: '상시 복용', value: 'REGULAR' },
  { label: '필요시 복용', value: 'AS_NEEDED' },
  { label: '복용 중단', value: 'STOPPED' },
];
