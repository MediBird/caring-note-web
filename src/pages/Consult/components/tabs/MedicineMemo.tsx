import {
  AddAndUpdateMedicationRecordHistReq,
  MedicationControllerApi,
  MedicationRecordHistControllerApi,
  SelectMedicationRecordHistRes,
  SelectMedicationRecordHistResDivisionCodeEnum,
} from '@/api/api';
import NulpeumImg from '@/assets/temp-nulpeum.png';
import SearchComponent from '@/components/common/SearchComponent';
import TableComponent from '@/components/common/TableComponent';
import { Button } from '@/components/ui/button';
import DatePickerComponent from '@/components/ui/datepicker';
import useMedicineMemoStore from '@/store/medicineMemoStore';
import useNomalMedicineTableStore from '@/store/nomalMedicineTableStore';
import usePrescribedMedicineTableStore from '@/store/prescribedMedicineTableStore';
import {
  createDefaultNumberColumn,
  createDefaultTextColumn,
} from '@/utils/TableUtils';
import { GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GrayContainer from '../GrayContainer';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';

const MedicineMemo: React.FC = () => {
  const { counselSessionId } = useParams();

  const medicationApi = new MedicationControllerApi();
  const medicationRecordHistControllerApi =
    new MedicationRecordHistControllerApi();

  // TODO: 쿼리 커스텀 훅 분리 및 데이터 store set init 로직 개선 필요
  const searchMedicationByKeyword = async (keyword: string) => {
    const response = await medicationApi.searchMedicationByKeyword(keyword);
    console.log('searchMedicationByKeyword', response);
    return response;
  };

  const selectMedicationRecordListBySessionId1 = async () => {
    if (!counselSessionId) return;
    const response =
      await medicationRecordHistControllerApi.selectMedicationRecordListBySessionId1(
        counselSessionId,
      );
    console.log('selectMedicationRecordListBySessionId1', response);
    return response;
  };

  const addAndUpdateMedicationRecordHist = async (
    editedData: AddAndUpdateMedicationRecordHistReq[],
  ) => {
    if (!counselSessionId) return;
    const response =
      await medicationRecordHistControllerApi.addAndUpdateMedicationRecordHist(
        counselSessionId,
        editedData,
      );
    console.log('addAndUpdateMedicationRecordHist', response);
    return response;
  };

  const [keyword, setKeyword] = useState<string>('');

  const searchMedicationByKeywordQuery = useQuery({
    queryKey: ['searchMedicationByKeyword', keyword],
    queryFn: () => searchMedicationByKeyword(keyword),
    enabled: keyword.length > 1,
  });

  const selectMedicationRecordListBySessionIdQuery = useQuery({
    queryKey: ['selectMedicationRecordListBySessionId', counselSessionId],
    queryFn: selectMedicationRecordListBySessionId1,
    enabled: !!counselSessionId,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addAndUpdateMedicationRecordHistQuery = useQuery({
    queryKey: ['addAndUpdateMedicationRecordHist', counselSessionId],
    queryFn: () => addAndUpdateMedicationRecordHist(editedData || []),
    enabled: !!counselSessionId,
  });

  const { originalData, editedData, setOriginalData, setHttpStatus } =
    useMedicineMemoStore();

  const {
    normalMedicineRows,
    addNormalMedicineRow,
    updateNormalMedicineRowById,
    setSelectedNormalMedicineRowIds,
  } = useNomalMedicineTableStore();

  const {
    prescribedMedicineRows,
    selectedPrescribedMedicineRowIds,
    addPrescribedMedicineRow,
    updatePrescribedMedicineRowById,
    deletePrescribedMedicineRowById,
    setSelectedPrescribedMedicineRowIds,
  } = usePrescribedMedicineTableStore();

  useEffect(() => {
    // API 호출

    // 처방 의약품 데이터 셋팅
    if (
      selectMedicationRecordListBySessionIdQuery.isSuccess &&
      JSON.stringify(originalData) === '[]'
    ) {
      if (setHttpStatus)
        setHttpStatus(
          selectMedicationRecordListBySessionIdQuery.data?.status || 0,
        );
      if (setOriginalData)
        setOriginalData([
          ...(selectMedicationRecordListBySessionIdQuery.data?.data?.data ||
            []),
        ]);

      console.log('jw, medicineMemo:: originalData updated!!');

      // 의약품 테이블 zustand 데이터 세팅
      (
        selectMedicationRecordListBySessionIdQuery.data?.data
          ?.data as SelectMedicationRecordHistRes[]
      )?.map((item) => {
        if (
          item.divisionCode ===
          SelectMedicationRecordHistResDivisionCodeEnum.Prescription
        ) {
          addPrescribedMedicineRow({
            id: item.rowId,
            col1: item.usageStatusCode,
            col2: item.medicationName,
            col3: item.usageObject,
            col4: item.prescriptionDate,
            col5: item.prescriptionDays,
          });
        } else if (
          item.divisionCode ===
          SelectMedicationRecordHistResDivisionCodeEnum.Otc
        ) {
          addNormalMedicineRow({
            id: item.rowId,
            col1: item.usageStatusCode,
            col2: item.medicationName,
            col3: item.usageObject,
            col4: item.prescriptionDate,
            col5: item.prescriptionDays,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectMedicationRecordListBySessionIdQuery.isSuccess,
    addNormalMedicineRow,
    addPrescribedMedicineRow,
    setHttpStatus,
    setOriginalData,
  ]);

  const columns: GridColDef[] = [
    {
      field: 'col1',
      headerName: '사용상태',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['상시 복용', '필요 시 복용', '복용 중단'],
      renderCell: (params) => {
        return (
          params.value || <span className="italic text-gray-400">선택</span>
        );
      },
      // headerClassName: "!pl-6",
      // cellClassName: "!pl-6",
    },
    {
      field: 'col2',
      headerName: '성분명 / 상품명',
      flex: 1,
      cellClassName: '!relative !h-full !overflow-visible',
      editable: true,
      renderCell: (params) => {
        return (
          <div className="max-w-full truncate">
            {params.value || (
              <span className="italic text-gray-400">{'성분명 / 상품명'}</span>
            )}
          </div>
        );
      },
      renderEditCell: (params) => {
        return (
          <SearchComponent
            items={
              searchMedicationByKeywordQuery.data?.data?.data?.map(
                (item) => item.itemName || '',
              ) || []
            }
            placeholder="성분명 / 상품명"
            onSelect={(item) => {
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: item,
              });
            }}
            onChangeInputValue={(value) => {
              setKeyword(value);
            }}
          />
        );
      },
    },
    {
      ...createDefaultTextColumn({
        field: 'col3',
        headerName: '약물 사용 목적',
      }),
      editable: true,
    },
    {
      field: 'col4',
      headerName: '처방 날짜',
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center w-full h-full ">
            <DatePickerComponent
              initialDate={params.value ? new Date(params.value) : undefined}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              handleClicked={(date) => {
                // TODO:: updatePrescribedMedicineRowById 무한렌더링 유발 임시 주석 처리
                // updatePrescribedMedicineRowById({
                //   ...params.row,
                //   col4: date ? moment(date).format('YYYY-MM-DD') : '',
                // });
              }}
            />
          </div>
        );
      },
    },
    {
      ...createDefaultNumberColumn({
        field: 'col5',
        headerName: '처방 일수',
        unitName: '일',
      }),
      editable: true,
    },
  ];

  const test = () => {
    console.log('originalData', originalData);
    console.log('prescribedMedicineRows', prescribedMedicineRows);

    // prescribedMedicineRows와 normalMedicineRows 에 수정되어 저장돼있는걸 editedData 에 이쁘게 넣어주기
    editedData?.map((item) => {
      // 처방의약품
      const prescribedIdx = prescribedMedicineRows.findIndex(
        (row) => row.id === item.rowId,
      );
      // 조회해온 처방의약품을 수정한 경우
      if (prescribedIdx !== -1) {
        item.usageStatusCode = prescribedMedicineRows[prescribedIdx].col1;
        item.name = prescribedMedicineRows[prescribedIdx].col2;
        item.usageObject = prescribedMedicineRows[prescribedIdx].col3;
        item.prescriptionDate = prescribedMedicineRows[prescribedIdx].col4;
        item.prescriptionDays = prescribedMedicineRows[prescribedIdx].col5;
      }

      // 일반의약품
      const normalIdx = normalMedicineRows.findIndex(
        (row) => row.id === item.rowId,
      );
      // 조회해온 일반의약품을 수정한 경우
      if (normalIdx !== -1) {
        item.usageStatusCode = normalMedicineRows[normalIdx].col1;
        item.name = normalMedicineRows[normalIdx].col2;
        item.usageObject = normalMedicineRows[normalIdx].col3;
        item.prescriptionDate = normalMedicineRows[normalIdx].col4;
        item.prescriptionDays = normalMedicineRows[normalIdx].col5;
      }

      // 모든 row에 대해 medicationId 를 넣어주기 (있는 경우에만)
      item.medicationId =
        searchMedicationByKeywordQuery.data?.data?.data?.find(
          (medication) => medication.itemName === item.name,
        )?.id || '';
    });

    // 추가된 처방의약품과 일반의약품을 editedData 에 넣어주기
    prescribedMedicineRows.forEach((row) => {
      if (editedData?.findIndex((item) => item.rowId === row.id) === -1) {
        editedData?.push({
          rowId: row.id,
          divisionCode:
            SelectMedicationRecordHistResDivisionCodeEnum.Prescription,
          usageStatusCode: row.col1,
          name: row.col2,
          usageObject: row.col3,
          prescriptionDate: row.col4,
          prescriptionDays: row.col5,
          medicationId:
            searchMedicationByKeywordQuery.data?.data?.data?.find(
              (medication) => medication.itemName === row.col2,
            )?.id || '',
        });
      }
    });
    normalMedicineRows.forEach((row) => {
      if (editedData?.findIndex((item) => item.rowId === row.id) === -1) {
        editedData?.push({
          rowId: row.id,
          divisionCode: SelectMedicationRecordHistResDivisionCodeEnum.Otc,
          usageStatusCode: row.col1,
          name: row.col2,
          usageObject: row.col3,
          prescriptionDate: row.col4,
          prescriptionDays: row.col5,
          medicationId:
            searchMedicationByKeywordQuery.data?.data?.data?.find(
              (medication) => medication.itemName === row.col2,
            )?.id || '',
        });
      }
    });

    console.log('수정된 editedData', editedData);

    // edited Data 에 있는 값으로 API 호출
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>의약물 기록</CardTitle>
        </div>
      </CardHeader>
      <GrayContainer
        title="처방 의약품"
        subTitle="최근 3개월 이내 복용 기준 약물 이용 내역"
        titleButton={
          <div className="inline-block">
            <Button
              variant="secondaryError"
              onClick={() =>
                deletePrescribedMedicineRowById(
                  selectedPrescribedMedicineRowIds,
                )
              }
              disabled={selectedPrescribedMedicineRowIds.length == 0}>
              선택항목 삭제
            </Button>
          </div>
        }>
        <div className="h-auto">
          <TableComponent
            tableKey="prescribedMedicineTable"
            rows={prescribedMedicineRows}
            columns={columns}
            checkboxSelection={true}
            onUpdateCell={updatePrescribedMedicineRowById}
            onRowSelectionModelChange={setSelectedPrescribedMedicineRowIds}
            withAddButton
            onClickAddButton={() => {
              addPrescribedMedicineRow({
                col1: '',
                col2: '',
                col3: '',
                col4: '',
                col5: null,
              });
            }}
          />
        </div>
      </GrayContainer>

      <GrayContainer
        title="일반 의약품"
        subTitle="가정 내 보관중인 모든 식품"
        titleButton={
          <div className="inline-block">
            <Button
              variant="secondaryError"
              onClick={() =>
                deletePrescribedMedicineRowById(
                  selectedPrescribedMedicineRowIds,
                )
              }
              disabled={selectedPrescribedMedicineRowIds.length == 0}>
              선택항목 삭제
            </Button>
          </div>
        }>
        <div className="h-auto">
          <TableComponent
            tableKey="nomalMedicineTable"
            rows={normalMedicineRows}
            columns={columns}
            checkboxSelection={true}
            onUpdateCell={updateNormalMedicineRowById}
            onRowSelectionModelChange={setSelectedNormalMedicineRowIds}
            withAddButton
            onClickAddButton={() => {
              addNormalMedicineRow({
                col1: '',
                col2: '',
                col3: '',
                col4: '',
                col5: null,
              });
            }}
          />
        </div>
      </GrayContainer>

      <div>
        <p
          className="mt-8 font-bold text-subtitle2 text-grayscale-90"
          onClick={test}>
          유용한 사이트 (TEST : 여기를 클릭하여 의약물 등록 API 호출)
        </p>
        <div className="mt-6">
          <img
            src={NulpeumImg}
            alt="늘픔가치"
            className="inline-block mr-4 w-60 h-60"
          />
          <img
            src={NulpeumImg}
            alt="늘픔가치"
            className="inline-block mr-4 w-60 h-60"
          />
          <img
            src={NulpeumImg}
            alt="늘픔가치"
            className="inline-block mr-4 w-60 h-60"
          />
        </div>
      </div>
    </>
  );
};

export default MedicineMemo;
