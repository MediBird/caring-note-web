import { SearchMedicationByKeywordRes } from '@/api/api';
import TableComponent from '@/components/common/TableComponent';
import { Button } from '@/components/ui/button';
import SearchComponent from '@/components/common/SearchComponent';
import { GridColDef, GridRowModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDeleteMedicationList } from '../../hooks/query/useDeleteMedicationList';

import TabContentTitle from '@/components/consult/TabContentTitle';
import InfoIcon from '@/assets/icon/20/info.filled.blue.svg?react';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';
import { useWasteMedicationList } from '@/pages/Consult/hooks/query/useWasteMedicationListQuery';
import { useSearchMedicationByKeyword } from '@/pages/Consult/hooks/query/useSearchMedicationByKeyword';
import { WasteMedicationListDTO } from '@/types/WasteMedicationDTO';
import Badge from '@/components/common/Badge';

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
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const { deleteMedicationListMutation } = useDeleteMedicationList();
  const [keyword, setKeyword] = useState<string>('');

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

  // 약품 검색 결과 조회
  const { data: searchMedicationByKeywordList } =
    useSearchMedicationByKeyword(keyword);

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

  console.log(wasteMedicationList);

  const handleUpdateCell = (params: GridRowModel) => {
    const { id, field, value } = params;

    const updatedItem: WasteMedicationListDTO | undefined =
      wasteMedicationList.find((item) => item.id === id);

    if (!updatedItem) return;

    updateWasteMedicationListById(id, {
      ...updatedItem,
      [field as keyof WasteMedicationListDTO]: value,
    });
  };

  const handleUpdateMedicationInfo = (
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

  const columns = getDiscardMedicineColumns(
    searchMedicationByKeywordList ?? [],
    setKeyword,
    handleUpdateCell,
    handleUpdateMedicationInfo,
  );

  return (
    <div className="mt-8">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          {showTable && !isNone && <TabContentTitle text="폐의약품 목록" />}

          {showTable && isNone && (
            <>
              <TabContentTitle
                className="!text-grayscale-40"
                text="폐의약품 목록"
              />
              <span className="mt-2 mb-4 text-grayscale-40">(해당 없음)</span>
            </>
          )}

          {!showTable && (
            <>
              <TabContentTitle text="폐의약품 목록" />
              <Badge
                className="mt-2 mb-6" // TabContentTitle 의 margin-top, margin-bottom 과 동일하게 맞춤
                variant="tint"
                customIcon={<InfoIcon width={20} height={20} />}>
                상단 선택지를 먼저 골라주세요
              </Badge>
            </>
          )}
        </div>
        <Button
          variant="secondary"
          disabled={selectedRowIds.length === 0}
          onClick={() => {
            if (!counselSessionId) return;
            if (selectedRowIds.length === 0) return;

            deleteMedicationListMutation.mutate({
              counselSessionId: counselSessionId,
              wasteMedicationRecordIds: selectedRowIds,
            });
          }}>
          선택항목 삭제하기
        </Button>
      </div>
      <TableComponent
        tableKey="discard-medicine-table"
        rows={wasteMedicationList ?? []}
        columns={columns}
        checkboxSelection={true}
        onRowSelectionModelChange={(details) => {
          setSelectedRowIds([...details]);
        }}
        withAddButton
        onClickAddButton={() => {
          setWasteMedicationList([
            ...wasteMedicationList,
            {
              id:
                'WASTE-RECORD-HIST-' + (Number(wasteMedicationList.length) + 1),
              medicationId: 'temp',
              medicationName: '',
              unit: 0,
              disposalReason: '',
            },
          ]);
        }}
      />
    </div>
  );
};

const getDiscardMedicineColumns = (
  searchMedicationByKeywordList: SearchMedicationByKeywordRes[],
  setKeyword: (value: string) => void,
  handleUpdateCell: (update: GridRowModel) => void,
  handleUpdateMedicationInfo: (
    id: string,
    medicationId: string,
    medicationName: string,
  ) => void,
): GridColDef[] => {
  const columns: GridColDef[] = [
    {
      field: 'medicationName',
      headerName: '성분명 / 상품명',
      flex: 1,
      editable: true,
      type: 'singleSelect',

      cellClassName: () => {
        return '!relative !h-full !overflow-visible';
      },
      renderEditCell: (params) => {
        return (
          <SearchComponent
            {...params}
            placeholder="성분명 / 상품명을 검색하세요"
            items={searchMedicationByKeywordList.map(
              (item) => item.itemName || '',
            )}
            onChangeInputValue={(value) => setKeyword(value)}
            defaultInputValue={params.value}
            onSelect={(value) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'medicationName',
                value: value,
              });

              const medicationId = searchMedicationByKeywordList.find(
                (item) => item.itemName === value,
              )?.id;

              handleUpdateMedicationInfo(
                params.id as string,
                medicationId as string,
                value,
              );

              params.api.stopCellEditMode({
                id: params.id,
                field: 'medicationName',
              });
            }}
          />
        );
      },
      renderCell: (params) => {
        return (
          <div className="truncate max-w-full">
            {params.value || (
              <span className="text-gray-400 italic">{'성분명 / 상품명'}</span>
            )}
          </div>
        );
      },
    },
    {
      field: 'unit',
      headerName: '제품 단위',
      width: 144,
      editable: true,
      renderEditCell: (params) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = event.target.value;

          // DataGrid 상태 업데이트
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: newValue,
          });

          // handleUpdateCell 호출
          handleUpdateCell({
            id: params.id,
            field: params.field,
            value: newValue,
          });
        };

        return (
          <input
            type="text"
            value={params.value || ''}
            onChange={handleChange}
            className="w-full p-1 rounded border-none focus:outline-none"
          />
        );
      },
    },
    {
      field: 'disposalReason',
      headerName: '폐기 원인',
      flex: 1,
      editable: true,
      renderEditCell: (params) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = event.target.value;

          // DataGrid 상태 업데이트
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: newValue,
          });

          // handleUpdateCell 호출
          handleUpdateCell({
            id: params.id,
            field: params.field,
            value: newValue,
          });
        };

        return (
          <input
            type="text"
            value={params.value || ''}
            onChange={handleChange}
            className="w-full p-1 rounded border-none focus:outline-none "
          />
        );
      },
    },
  ];
  return columns;
};

export default WasteMedicationTable;
