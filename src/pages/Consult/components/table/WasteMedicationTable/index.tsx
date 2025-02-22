import { DataTable } from '@/components/common/DataTable/data-table';
import AddTableRowButton from '@/components/common/DataTable/add-table-row-button';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';
import { useEffect } from 'react';
import { useDeleteMedicationList } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useDeleteWasteMedicationList';
import { useWasteMedicationList } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationListQuery';
import { WasteMedicationListDTO } from '@/types/WasteMedicationDTO';
import { createColumns } from './wasteMedicationColumns';

interface WasteMedicationTableProps {
  counselSessionId: string;
  showTable: boolean;
  isNone: boolean;
}

const WasteMedicationTable = ({
  counselSessionId,
  showTable,
  isNone,
}: WasteMedicationTableProps) => {
  const { deleteWasteMedicationListMutation } = useDeleteMedicationList();

  //폐의약품 목록 조회
  const {
    data: wasteMedicationListData,
    isSuccess: isSuccessWasteMedicationList,
  } = useWasteMedicationList(counselSessionId as string);

  //폐의약품 목록 store
  const {
    wasteMedicationList,
    setWasteMedicationList,
    updateWasteMedicationListById,
  } = useWasteMedicationListStore();

  //초기 로딩시 폐의약품 목록 저장
  useEffect(() => {
    if (isSuccessWasteMedicationList && wasteMedicationListData) {
      setWasteMedicationList(
        wasteMedicationListData.map((item) => ({
          id: item.rowId ?? '',
          rowId: item.rowId,
          medicationId: item.medicationId ?? '',
          medicationName: item.medicationName ?? '',
          unit: item.unit ?? 0,
          disposalReason: item.disposalReason ?? '',
        })),
      );
    }
  }, [
    isSuccessWasteMedicationList,
    wasteMedicationListData,
    setWasteMedicationList,
    counselSessionId,
  ]);

  const handleUpdateCell = (
    id: string,
    field: string,
    value: string | number,
  ) => {
    const updatedItem: WasteMedicationListDTO | undefined =
      wasteMedicationList.find((item) => item.id === id);

    if (!updatedItem) return;

    updateWasteMedicationListById(id, {
      ...updatedItem,
      [field as keyof WasteMedicationListDTO]: value,
    });
  };

  const handleSearchEnter = (
    id: string,
    medicationId: string,
    medicationName: string,
  ) => {
    const updatedItem: WasteMedicationListDTO | undefined =
      wasteMedicationList.find((item) => item.id === id);

    if (!updatedItem) return;

    updateWasteMedicationListById(id, {
      ...updatedItem,
      medicationId,
      medicationName,
    });
  };

  const handleDelete = (id: string) => {
    if (id.includes('temp')) {
      const filteredList = wasteMedicationList.filter((item) => item.id !== id);

      setWasteMedicationList(filteredList);
    } else {
      deleteWasteMedicationListMutation.mutate({
        counselSessionId: counselSessionId as string,
        wasteMedicationRecordIds: [id],
      });
    }
  };

  const columns = createColumns({
    onDelete: handleDelete,
    handleUpdateCell,
    handleSearchEnter,
  });

  return (
    <DataTable
      columns={columns}
      data={wasteMedicationList}
      footer={
        showTable && !isNone ? (
          <AddTableRowButton
            onClickAddButton={() => {
              setWasteMedicationList([
                ...wasteMedicationList,
                {
                  id: 'temp' + Math.random().toString(36).substring(2, 15),
                  medicationId: '',
                  medicationName: '',
                  unit: 0,
                  disposalReason: '',
                },
              ]);
            }}
          />
        ) : null
      }
    />
  );
};

export default WasteMedicationTable;
