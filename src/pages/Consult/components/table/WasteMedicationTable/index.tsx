import { DataTable } from '@/components/common/DataTable/DataTable';
import { createColumns } from './wasteMedicationColumns';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';
import { useEffect } from 'react';
import { useDeleteMedicationList } from '@/pages/Consult/hooks/query/useDeleteMedicationList';
import { useWasteMedicationList } from '@/pages/Consult/hooks/query/useWasteMedicationListQuery';
import { WasteMedicationListDTO } from '@/types/WasteMedicationDTO';
import PlusBlueIcon from '@/assets/icon/24/add.outlined.blue.svg?react';

interface WasteMedicationTableProps {
  counselSessionId: string;
}

const WasteMedicationTable = ({
  counselSessionId,
}: WasteMedicationTableProps) => {
  const { deleteMedicationListMutation } = useDeleteMedicationList();

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
      console.log(
        wasteMedicationListData.map((item) => ({
          rowId: item.rowId,
          medicationId: item.medicationId ?? '',
          medicationName: item.medicationName ?? '',
          unit: item.unit ?? 0,
          disposalReason: item.disposalReason ?? '',
        })),
      );

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

  const handleUpdateCell = (id: string, field: string, value: string) => {
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

  const columns = createColumns({
    onDelete: (id) => {
      deleteMedicationListMutation.mutate({
        counselSessionId: counselSessionId as string,
        wasteMedicationRecordIds: [id],
      });
    },
    handleUpdateCell,
    handleSearchEnter,
  });

  return (
    <DataTable
      columns={columns}
      data={wasteMedicationList}
      footer={
        <AddMedicationButton
          onClickAddButton={() => {
            setWasteMedicationList([
              ...wasteMedicationList,
              {
                id: 'temp',
                medicationId: 'temp',
                medicationName: '',
                unit: 0,
                disposalReason: '',
              },
            ]);
          }}
        />
      }
    />
  );
};

export default WasteMedicationTable;

const AddMedicationButton = ({
  onClickAddButton,
}: {
  onClickAddButton: () => void;
}) => {
  return (
    <div
      className="flex items-center hover:cursor-pointer gap-[10px]"
      onClick={onClickAddButton}>
      <PlusBlueIcon
        className="inline-block"
        width={24}
        height={24}></PlusBlueIcon>
      <span className="text-body1 text-primary-50 ">추가하기</span>
    </div>
  );
};
