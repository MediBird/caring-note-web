import {
  AddAndUpdateMedicationRecordHistReq,
  MedicationControllerApi,
  MedicationRecordHistControllerApi,
  SelectMedicationRecordHistRes,
  SelectMedicationRecordHistResDivisionCodeEnum,
} from "@/api/api";
import NulpeumImg from "@/assets/temp-nulpeum.png";
import SearchComponent from "@/components/common/SearchComponent";
import TableComponent from "@/components/common/TableComponent";
import TabContentContainer from "@/components/consult/TabContentContainer";
import { Button } from "@/components/ui/button";
import useMedicineMemoStore from "@/store/medicineMemoStore";
import useNomalMedicineTableStore from "@/store/nomalMedicineTableStore";
import usePrescribedMedicineTableStore from "@/store/prescribedMedicineTableStore";
import {
  createDefaultDateColumn,
  createDefaultNumberColumn,
  createDefaultTextColumn,
} from "@/utils/TableUtils";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import GrayContainer from "../GrayContainer";

const MedicineMemo: React.FC = () => {
  const counselSessionId = "TEST-COUNSEL-SESSION-01"; // TODO : 다른 곳에서 전달받아야됨

  const medicationApi = new MedicationControllerApi();
  const medicationRecordHistControllerApi =
    new MedicationRecordHistControllerApi();

  const searchMedicationByKeyword = async (keyword: string) => {
    const response = await medicationApi.searchMedicationByKeyword(keyword);
    console.log("searchMedicationByKeyword", response);
    return response;
  };
  const selectMedicationRecordListBySessionId1 = async () => {
    const response =
      await medicationRecordHistControllerApi.selectMedicationRecordListBySessionId1(
        counselSessionId,
      );
    console.log("selectMedicationRecordListBySessionId1", response);
    return response;
  };
  const addAndUpdateMedicationRecordHist = async (
    editedData: AddAndUpdateMedicationRecordHistReq[],
  ) => {
    const response =
      await medicationRecordHistControllerApi.addAndUpdateMedicationRecordHist(
        counselSessionId,
        editedData,
      );
    console.log("addAndUpdateMedicationRecordHist", response);
    return response;
  };

  const searchMedicationByKeywordQuery = useQuery({
    queryKey: ["searchMedicationByKeyword"],
    queryFn: () => searchMedicationByKeyword(""),
    enabled: false,
  });
  const selectMedicationRecordListBySessionIdQuery = useQuery({
    queryKey: ["selectMedicationRecordListBySessionId"],
    queryFn: selectMedicationRecordListBySessionId1,
    enabled: false,
  });
  const addAndUpdateMedicationRecordHistQuery = useQuery({
    queryKey: ["addAndUpdateMedicationRecordHist"],
    queryFn: () => addAndUpdateMedicationRecordHist(editedData || []),
    enabled: false,
  });

  const {
    originalData,
    editedData,
    setOriginalData,
    setEditedData,
    setHttpStatus,
  } = useMedicineMemoStore();

  const {
    normalMedicineRows,
    selectedNormalMedicineRowIds,
    addNormalMedicineRow,
    updateNormalMedicineRowById,
    deleteNormalMedicineRowById,
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
    searchMedicationByKeywordQuery.refetch();
    selectMedicationRecordListBySessionIdQuery.refetch().then(() => {
      // 처방 의약품 데이터 셋팅
      if (
        selectMedicationRecordListBySessionIdQuery.isSuccess &&
        JSON.stringify(originalData) === "[]"
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

        console.log("jw, medicineMemo:: originalData updated!!");

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
    });
  }, [originalData]);

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "사용상태",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: ["상시 복용", "필요 시 복용", "복용 중단"],
      renderCell: (params) => {
        return (
          params.value || <span className="text-gray-400 italic">선택</span>
        );
      },
      // headerClassName: "!pl-6",
      // cellClassName: "!pl-6",
    },
    {
      field: "col2",
      headerName: "성분명 / 상품명",
      flex: 1,
      cellClassName: "!relative !h-full !overflow-visible",
      editable: true,
      renderCell: (params) => {
        return (
          <div className="truncate max-w-full">
            {params.value || (
              <span className="text-gray-400 italic">{"성분명 / 상품명"}</span>
            )}
          </div>
        );
      },
      renderEditCell: (params) => {
        return (
          <SearchComponent
            items={
              searchMedicationByKeywordQuery.data?.data?.data?.map(
                (item) => item.itemName || "",
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
          />
        );
      },
    },
    {
      ...createDefaultTextColumn({
        field: "col3",
        headerName: "약물 사용 목적",
      }),
      editable: true,
    },
    {
      ...createDefaultDateColumn({
        field: "col4",
        headerName: "처방 날짜",
      }),
      editable: true,
    },
    {
      ...createDefaultNumberColumn({
        field: "col5",
        headerName: "처방 일수",
        unitName: "일",
      }),
      editable: true,
    },
  ];

  const test = () => {
    console.log("originalData", originalData);
    console.log("prescribedMedicineRows", prescribedMedicineRows);

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
        )?.id || "";
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
            )?.id || "",
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
            )?.id || "",
        });
      }
    });

    console.log("수정된 editedData", editedData);

    // edited Data 에 있는 값으로 API 호출
    addAndUpdateMedicationRecordHistQuery.refetch();
  };

  return (
    <>
      <TabContentContainer>
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
                  col1: "",
                  col2: "",
                  col3: "",
                  col4: "",
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
                  col1: "",
                  col2: "",
                  col3: "",
                  col4: "",
                  col5: null,
                });
              }}
            />
          </div>
        </GrayContainer>

        <div>
          <p
            className="text-subtitle2 font-bold text-grayscale-90 mt-8"
            onClick={test}>
            유용한 사이트 (TEST : 여기를 클릭하여 의약물 등록 API 호출)
          </p>
          <div className="mt-6">
            <img
              src={NulpeumImg}
              alt="늘픔가치"
              className="w-60 h-60 inline-block mr-4"
            />
            <img
              src={NulpeumImg}
              alt="늘픔가치"
              className="w-60 h-60 inline-block mr-4"
            />
            <img
              src={NulpeumImg}
              alt="늘픔가치"
              className="w-60 h-60 inline-block mr-4"
            />
          </div>
        </div>
      </TabContentContainer>
    </>
  );
};

export default MedicineMemo;
