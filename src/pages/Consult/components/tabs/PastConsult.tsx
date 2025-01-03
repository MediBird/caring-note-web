import {
  CounselSessionControllerApi,
  MedicationCounselControllerApi,
  SelectPreviousCounselSessionListRes,
  SelectPreviousMedicationCounselRes,
} from "@/api";
import TableComponent from "@/components/common/TableComponent";
import PastConsultContainer from "@/components/consult/PastConsultContainer";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import {
  createDefaultDateColumn,
  createDefaultNumberColumn,
  createDefaultTextColumn,
} from "@/utils/TableUtils";
import moment from "moment";
import React, { useEffect } from "react";
import { useAppDispatch } from "../../../../app/reduxHooks";
import TabContentContainer from "../../../../components/consult/TabContentContainer";
import TabContentTitle from "../../../../components/consult/TabContentTitle";
import { changeActiveTab } from "../../../../reducers/tabReducer";

const PastConsult: React.FC = () => {
  const counselSessionId = "TEST-COUNSEL-SESSION-01"; // TODO : 다른 곳에서 전달받아야됨

  const counselSessionControllerApi = new CounselSessionControllerApi();
  const medicationCounselControllerApi = new MedicationCounselControllerApi();

  const selectPreviousMedicationCounsel = async () => {
    const response =
      await medicationCounselControllerApi.selectPreviousMedicationCounsel(
        counselSessionId,
      );
    console.log(response.data);
    return response;
  };
  const selectPreviousCounselSessionList = async () => {
    const response =
      await counselSessionControllerApi.selectPreviousCounselSessionList(
        counselSessionId,
      );
    console.log(response.data);
    return response;
  };

  const previousMedicationCounselQuery = useQuery({
    queryKey: ["selectPreviousMedicationCounsel"],
    queryFn: selectPreviousMedicationCounsel,
  });
  const previousCounselSessionListQuery = useQuery({
    queryKey: ["selectPreviousCounselSessionList"],
    queryFn: selectPreviousCounselSessionList,
  });

  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changeActiveTab("/consult/pastConsult")); // 해당 tab의 url
  }, []);

  const columns: GridColDef[] = [
    {
      ...createDefaultNumberColumn({
        field: "col1",
        headerName: "상담횟수",
        unitName: "회차",
        isFirstColumn: true,
      }),
    },
    {
      ...createDefaultDateColumn({
        field: "col2",
        headerName: "상담일자",
      }),
    },
    { ...createDefaultTextColumn({ field: "col3", headerName: "담당약사" }) },
    {
      ...createDefaultTextColumn({ field: "col4", headerName: "케어링메세지" }),
    },
  ];
  const memoizedColumns = React.useMemo(() => columns, [columns]);

  const pastConsultRows = previousCounselSessionListQuery.data?.data?.data?.map(
    (counsel, index) => ({
      id: index + 1,
      col1: index + 1,
      col2: moment(counsel.counselSessionDate).format("YYYY-MM-DD"),
      col3: counsel.counselorName,
      col4: counsel.isShardCaringMessage ? "공유완료" : "-",
    }),
  );

  return (
    <>
      <TabContentContainer>
        <TabContentTitle text="이전 상담 내용" />
        <div className="flex flex-row justify-between items-start space-x-4">
          <PastConsultContainer title="상담 기록 하이라이트" variant="primary">
            <ul className="mt-4 text-body1 font-medium space-y-2">
              {previousMedicationCounselQuery?.data?.data?.data?.counselRecordHighlights?.map(
                (item, index) => {
                  return (
                    <li
                      key={index}
                      className="border-l-2 border-grayscale-10 pl-2">
                      {item}
                    </li>
                  );
                },
              )}
            </ul>
          </PastConsultContainer>

          <PastConsultContainer title="상담노트 요약" variant="secondary">
            <h2 className="text-subtitle2 font-bold text-secondary-70 flex items-center"></h2>
            <p className="mt-4 whitespace-pre-wrap">
              {
                previousMedicationCounselQuery?.data?.data?.data
                  ?.counselNoteSummary
              }
            </p>
          </PastConsultContainer>
        </div>

        <TabContentTitle className="mt-14" text="상담 내역" />
        <p className="text-body1 font-medium text-grayscale-70 ">
          케어링 노트로 남긴 상담 내역이 노출됩니다
        </p>
        <div className="h-auto mt-4">
          <TableComponent
            tableKey={"past-consult"}
            rows={pastConsultRows || []}
            columns={memoizedColumns}
          />
        </div>
      </TabContentContainer>
    </>
  );
};

export default PastConsult;
