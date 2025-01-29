import TableComponent from '@/components/common/TableComponent';
import { Button } from '@/components/ui/button';

import { useSelectCounselSessionList } from '@/hooks/useCounselSessionQuery';
import {
  useCounselSessionStore,
  useDetailCounselSessionStore,
} from '@/store/counselSessionStore';
import { createDefaultTextColumn } from '@/utils/TableUtils';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import {
  SelectCounselSessionListItem,
  SelectCounselSessionListItemCardRecordStatusEnum,
  SelectCounselSessionListItemStatusEnum,
} from '@/api/api';
import { useCounseleeConsentQueryId } from '@/pages/Survey/hooks/useCounselAgreeQuery';
import Index from '@/pages/Survey/dialogs/userInfo/Index';
import { useCounselAgreeSessionStore } from '@/store/counselAgreeStore';
import { useNavigate } from 'react-router-dom';

const SurveyList = () => {
  // useNavigate를 사용하여 페이지 이동
  const navigate = useNavigate();
  // isOpen 상태를 관리하는 state
  const [isOpen, setIsOpen] = useState(false);

  const { params } = useCounselSessionStore();
  const { data: items } = useSelectCounselSessionList(
    params ? { ...params, size: params.size ?? 15 } : { size: 15 },
  );
  // 상담 세션 상세 정보 조회
  const { detail, setDetail } = useDetailCounselSessionStore();
  const setCounseleeConsent = useCounselAgreeSessionStore(
    (state) => state.setCounseleeConsent,
  );
  // 내담자 개인정보 수집 동의 여부 조회
  const { data, isLoading } = useCounseleeConsentQueryId(
    detail?.counselSessionId || undefined,
    detail?.counseleeId || undefined,
    !!detail,
  );
  // 카드 작성 버튼 클릭 시
  const handleRegisterCard = (row: SelectCounselSessionListItem) => {
    setDetail(row);
  };

  useEffect(() => {
    // data가 있을경우
    if (!isLoading && data) {
      // data.status가 200이고 data.data.data?.isConsent가 true일 경우
      if (data.status === 200 && data.data.data?.isConsent === true) {
        navigate(`/survey/${detail?.counselSessionId}`);
      } else {
        setIsOpen(true);
      }
      setCounseleeConsent({
        counseleeConsentId: data?.data?.data?.counseleeConsentId,
        consent: data?.data?.data?.isConsent,
      });
    }
  }, [isLoading, data, setCounseleeConsent, navigate, detail]);

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
      headerName: '기초 상담 카드',
      flex: 1,
      renderCell: (params) => {
        // TODO : 할당 여부에 따라 버튼 diable 처리 (아래는 임시 코드)
        return params.value !==
          SelectCounselSessionListItemCardRecordStatusEnum.Recorded ? (
          <Button
            variant={'primary'}
            onClick={() => handleRegisterCard(params.row)}>
            카드 작성
          </Button>
        ) : (
          <Button variant={'secondary'} disabled>
            작성 완료
          </Button>
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

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

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
      <Index isOpen={isOpen} handleOpen={handleOpen} />
    </div>
  );
};

export default SurveyList;
