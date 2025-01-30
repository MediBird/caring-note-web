import TableComponent from '@/components/common/TableComponent';
import { useSelectCounselSessionList } from '@/hooks/useCounselSessionQuery';
import { useCounselSessionStore } from '@/store/counselSessionStore';
import { createDefaultTextColumn } from '@/utils/TableUtils';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect } from 'react';

import {
  SelectCounselSessionListItem,
  SelectCounselSessionListItemStatusEnum,
} from '@/api/api';
import SurveyDialog from '@/pages/Home/components/SurveyDialog';

const SurveyList = () => {
  const { params } = useCounselSessionStore();
  const { data: items } = useSelectCounselSessionList(
    params ? { ...params, size: params.size ?? 15 } : { size: 15 },
  );
  const columns: GridColDef[] = [
    {
      ...createDefaultTextColumn({
        field: 'scheduledTime',
        headerName: '예약 시각',
      }),
    },
    {
      ...createDefaultTextColumn({
        field: 'scheduledDate',
        headerName: '상담 일자',
      }),
    },
    {
      field: 'status',
      headerName: '상담 진행',
      flex: 1,
      renderCell: (params) => {
        // TODO : 할당 여부에 따라 버튼 diable 처리 (아래는 임시 코드)
        return params.value ===
          SelectCounselSessionListItemStatusEnum.Scheduled ? (
          <h2 className="text-black">예약</h2>
        ) : (
          <h2 className="text-primary-50">미예약</h2>
        );
      },
    },
    {
      ...createDefaultTextColumn({
        field: 'counseleeName',
        headerName: '내담자명',
      }),
    },
    {
      field: 'cardRecordStatus',
      headerName: '기초 설문',
      flex: 1,
      renderCell: (params) => {
        const recordStatus = params.value;
        const counselSessionId = params.row.counselSessionId;
        const counseleeId = params.row.counseleeId;
        return (
          <SurveyDialog
            counselSessionId={counselSessionId}
            dialogState={recordStatus}
            counseleeId={counseleeId}
          />
        );
      },
    },
  ];

  const testRows =
    items?.map((item: SelectCounselSessionListItem) => ({
      id: item.counselSessionId + '+' + (item.counseleeId ?? ''),
      counselSessionId: item.counselSessionId,
      counseleeId: item.counseleeId,
      scheduledTime: item.scheduledTime,
      scheduledDate: item.scheduledDate,
      status: item.status,
      counseleeName: item.counseleeName,
      cardRecordStatus: item.cardRecordStatus,
    })) || [];

  useEffect(() => {
    // data-scroll-locked 제거
    document.body.removeAttribute('data-scroll-locked');
  });
  return (
    <div>
      <div className="flex flex-col items-center justify-center pt-20 pb-20 bg-primary-30">
        <p className="w-full font-bold text-h2 text-primary-70 pl-28">
          박진완님, <br />
          오늘도 힘찬 하루를 보내세요!{' '}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center pt-20 bg-grayscale-3">
        <div className="flex flex-row items-center justify-center w-full px-24 mt-10 space-x-5">
          <div className="grid w-full grid-cols-2 p-6 bg-white rounded-lg shadow-lg">
            <div className="w-full p-4 text-center">
              <h1 className="text-xl font-bold text-secondary-50">
                약으로 이어지는 건강한 변화들
              </h1>
              <p className="text-sm text-gray-500">2025.03.01 기준</p>
            </div>
            <div className="flex grid-cols-2 gap-4">
              <div className="w-1/2 p-4 text-center rounded-lg bg-secondary-5">
                <h2 className="font-semibold text-grayscale-90">
                  복약상담소 방문자
                </h2>
                <p className="text-2xl font-bold text-secondary-50">
                  000,000명
                </p>
              </div>
              <div className="w-1/2 p-4 text-center rounded-lg bg-secondary-5">
                <h2 className="font-semibold text-grayscale-90">
                  케어링 메시지 연계
                </h2>
                <p className="text-2xl font-bold text-secondary-50">
                  000,000회
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-24 pt-10">
          <div className="w-full h-auto p-10 bg-white rounded-xl">
            <div className="mt-10">
              <TableComponent
                tableKey="home-table"
                rows={testRows}
                columns={columns}
                checkboxSelection={false}
                onUpdateCell={() => {}}
                onRowSelectionModelChange={() => {}}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-24 pt-10 pb-10">
          <div className="grid items-center w-full h-auto grid-cols-2 gap-4 p-10 bg-white rounded-xl">
            <div className="w-1/2 text-left">
              <h1 className="text-2xl font-bold text-primary-60">
                동료약사의 따뜻한 마음
              </h1>
            </div>
            <div className="w-full p-4 rounded-lg bg-primary-5">
              <p className="text-gray-700">
                약대 입학 후 얼마 안 되었을 때, 더 나은 사회를 위해 같이
                공부하고 행동해 보자는 글귀를 읽고 가입하기로 마음먹었어요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
