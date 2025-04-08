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
  handleUpdateCell: (
    id: string,
    field: string,
    value: string | number | null,
  ) => void;
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
      const usageStatusCode = row.original.usageStatusCode || '';
      const selectedOption = USAGE_STATUS_CODE_OPTIONS.find(
        (option) => option.value === usageStatusCode,
      );
      const initialValue =
        selectedOption?.value || USAGE_STATUS_CODE_OPTIONS[0].value;

      if (!row.original.usageStatusCode && row.original.id) {
        handleUpdateCell(
          row.original.id as string,
          'usageStatusCode',
          USAGE_STATUS_CODE_OPTIONS[0].value,
        );
      }

      return (
        <SelectCell
          initialValue={initialValue}
          options={USAGE_STATUS_CODE_OPTIONS}
          placeholder="사용 상태를 선택하세요"
          onValueChange={(value) => {
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
      const getInitialDate = () => {
        if (
          row.original.prescriptionDate &&
          row.original.prescriptionDate !== null
        ) {
          return new Date(row.original.prescriptionDate);
        }
        return undefined;
      };

      return (
        <DatePickerComponent
          initialDate={getInitialDate()}
          isDateUnknown={row.original.prescriptionDate === null}
          isPrescriptionDate={true}
          handleDateUnknown={() => {
            handleUpdateCell(
              row.original.id as string,
              'prescriptionDate',
              null,
            );
          }}
          placeholder="연도-월-일"
          handleClicked={(value) => {
            if (!value) return;

            const dateString = value.toISOString();
            const formattedDate = dateString.split('T')[0];

            handleUpdateCell(
              row.original.id as string,
              'prescriptionDate',
              formattedDate,
            );
          }}
          disableFutureDates={true}
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
            <div className="flex w-full items-center justify-center">
              <button className="content-center rounded-[4px] p-1 text-center text-grayscale-60 hover:bg-grayscale-5">
                <Ellipsis className="h-4 w-4" />
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
