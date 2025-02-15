import { SelectMedicationRecordHistResDivisionCodeEnum } from '@/api/api';
import AddTableRowButton from '@/components/common/DataTable/AddTableRowButton';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { createColumns } from '@/pages/Consult/components/table/MedicineRecordTable/medicineRecordTableColumns';
import { MedicationRecordListDTO } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordList';

interface MedicineRecordTableProps {
  divisionCode: SelectMedicationRecordHistResDivisionCodeEnum;
  medicineRecordList: MedicationRecordListDTO[];
  handleAddTableRowButton: (divisionCode: string) => void;
  handleUpdateCell: (id: string, field: string, value: string | number) => void;
  handleSearchEnter: (
    id: string,
    medicationId: string,
    medicationName: string,
  ) => void;
  onDelete: (id: string) => void;
}

const MedicineRecordTable = ({
  divisionCode,
  medicineRecordList,
  handleAddTableRowButton,
  handleUpdateCell,
  handleSearchEnter,
  onDelete,
}: MedicineRecordTableProps) => {
  const columns = createColumns({
    onDelete,
    handleUpdateCell,
    handleSearchEnter,
  });

  return (
    <DataTable
      columns={columns}
      data={medicineRecordList}
      footer={
        <AddTableRowButton
          onClickAddButton={() => {
            handleAddTableRowButton(divisionCode);
          }}
        />
      }
    />
  );
};

export default MedicineRecordTable;
