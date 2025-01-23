import {
  CounselSessionControllerApi,
  MedicationCounselControllerApi,
} from '@/api';
import TableComponent from '@/components/common/TableComponent';
import PastConsultContainer from '@/components/consult/PastConsultContainer';
import {
  createDefaultDateColumn,
  createDefaultNumberColumn,
  createDefaultTextColumn,
} from '@/utils/TableUtils';
import { GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import React from 'react';
import TabContentContainer from '@/components/consult/TabContentContainer';
import TabContentTitle from '@/components/consult/TabContentTitle';
import { useParams } from 'react-router-dom';

const PastConsult: React.FC = () => {
  const { counselSessionId } = useParams();

  // TODO: 쿼리 커스텀 훅 분리 및 데이터 store set init 로직 개선 필요
  const counselSessionControllerApi = new CounselSessionControllerApi();
  const medicationCounselControllerApi = new MedicationCounselControllerApi();

  const selectPreviousMedicationCounsel = async () => {
    if (!counselSessionId) return;
    const response =
      await medicationCounselControllerApi.selectPreviousMedicationCounsel(
        counselSessionId,
      );

    return response;
  };
  const selectPreviousCounselSessionList = async () => {
    if (!counselSessionId) return;
    const response =
      await counselSessionControllerApi.selectPreviousCounselSessionList(
        counselSessionId,
      );

    return response;
  };

  const previousMedicationCounselQuery = useQuery({
    queryKey: ['selectPreviousMedicationCounsel', counselSessionId],
    queryFn: selectPreviousMedicationCounsel,
    enabled: !!counselSessionId,
  });

  const previousCounselSessionListQuery = useQuery({
    queryKey: ['selectPreviousCounselSessionList', counselSessionId],
    queryFn: selectPreviousCounselSessionList,
    enabled: !!counselSessionId,
  });

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        ...createDefaultNumberColumn({
          field: 'col1',
          headerName: '상담횟수',
          unitName: '회차',
          isFirstColumn: true,
        }),
      },
      {
        ...createDefaultDateColumn({
          field: 'col2',
          headerName: '상담일자',
        }),
      },
      { ...createDefaultTextColumn({ field: 'col3', headerName: '담당약사' }) },
      {
        ...createDefaultTextColumn({
          field: 'col4',
          headerName: '케어링메세지',
        }),
      },
    ],
    [],
  );

  const memoizedColumns = React.useMemo(() => columns, [columns]);

  const pastConsultRows = previousCounselSessionListQuery.data?.data?.data?.map(
    (counsel, index) => ({
      id: index + 1,
      col1: index + 1,
      col2: moment(counsel.counselSessionDate).format('YYYY-MM-DD'),
      col3: counsel.counselorName,
      col4: counsel.isShardCaringMessage ? '공유완료' : '-',
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
                      {item.highlight}
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
            tableKey={'past-consult'}
            rows={pastConsultRows || []}
            columns={memoizedColumns}
          />
        </div>
      </TabContentContainer>
    </>
  );
};

export default PastConsult;
