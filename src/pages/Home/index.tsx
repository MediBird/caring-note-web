import { SelectCounselSessionListItem } from '@/api/api';
import CollegeMessage from '@/components/CollegeMessage';
import TableComponent from '@/components/common/TableComponent';
import ConsultCount from '@/components/ConsultCount';
import { useAuthContext } from '@/context/AuthContext';
import { useSelectCounselSessionList } from '@/hooks/useCounselSessionQuery';
import AssignDialog from '@/pages/Home/components/AssignDialog';
import {
  createDefaultDateColumn,
  createDefaultStatusColumn,
  createDefaultTextColumn,
} from '@/utils/TableUtils';
import { GridColDef, GridEventListener } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyDialog from './components/SurveyDialog';

function Home() {
  const { user } = useAuthContext();

  const { data: counselList, isLoading } = useSelectCounselSessionList({
    size: 15,
  });
  const navigate = useNavigate();

  const formattedCounselList = useMemo(() => {
    return counselList?.map((item: SelectCounselSessionListItem) => {
      return {
        ...item,
        id: item.counselSessionId,
      };
    });
  }, [counselList]);

  const handleCellClick: GridEventListener<'cellClick'> = (params) => {
    const navigableFields = [
      'scheduledTime',
      'scheduledDate',
      'status',
      'counseleeName',
      'counselorName',
    ];

    if (navigableFields.includes(params.field)) {
      navigate(`/consult/${params.row.counselSessionId}`);
    }
  };

  const columns = getCardColumns();
  return (
    <>
      <div className="flex flex-col h-full items-center justify-start bg-gray-50">
        <p className="w-full font-bold text-h3 text-primary-80 pl-20 pt-[148px] pb-6 bg-primary-30">
          {user?.name ?? ''}님, <br />
          오늘도 힘찬 하루를 보내세요!
        </p>
        <div className="flex w-full gap-8 2xl:items-start mt-8 justify-center 2xl:flex-row flex-col items-center">
          <div className="hidden 2xl:flex 2xl:flex-col gap-5 2xl:items-center 2xl:justify-center w-[278px]">
            <ConsultCount
              messageCount="1,234회"
              patientCount="201명"
              //반복 제거 필요
              date={new Date()
                .toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\. /g, '.')}
            />
            <CollegeMessage message="" />
          </div>

          <div className="flex justify-center 2xl:hidden max-w-[1020px] w-full">
            <ConsultCount
              messageCount="1,234회"
              patientCount="201명"
              date={new Date()
                .toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\. /g, '.')}
            />
          </div>
          <div className="flex flex-col items-center justify-center flex-grow w-full max-w-[1020px]">
            <div className="w-full h-auto p-6 bg-white rounded-xl shadow-container">
              <div className="flex items-center justify-between w-full h-10">
                <span className="font-bold text-2xl">오늘 일정</span>
              </div>
              <div className="mt-5">
                <TableComponent
                  tableKey="home-table"
                  rows={isLoading ? [] : formattedCounselList ?? []}
                  columns={columns}
                  checkboxSelection={false}
                  onUpdateCell={() => {}}
                  onCellClick={handleCellClick}
                  onRowSelectionModelChange={() => {}}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center 2xl:hidden max-w-[1020px] w-full">
            <CollegeMessage message="약대 입학 후 얼마 안 되었을 때, 더 나은 사회를 위해 같이 공부하고 행동해 보자는 글귀를 읽고 가입하기로 마음먹었어요." />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

const getCardColumns: () => GridColDef[] = () => {
  const columns: GridColDef[] = [
    {
      field: 'scheduledTime',
      headerName: '예약 시각',
      flex: 1,
      maxWidth: 112,
      cellClassName: 'cursor-pointer',
    },
    {
      ...createDefaultDateColumn({
        field: 'scheduledDate',
        headerName: '상담 일자',
      }),
      cellClassName: 'cursor-pointer',
    },
    {
      ...createDefaultStatusColumn({
        field: 'status',
        headerName: '상담 진행',
      }),
      cellClassName: 'cursor-pointer',
    },
    {
      ...createDefaultTextColumn({
        field: 'counseleeName',
        headerName: '내담자',
      }),
      cellClassName: 'cursor-pointer',
    },
    {
      ...createDefaultTextColumn({
        field: 'counselorName',
        headerName: '담당약사',
      }),
      cellClassName: 'cursor-pointer',
    },
    {
      field: 'counselorAssign',
      headerName: '상담 할당',
      flex: 1,
      renderCell: (params) => {
        return (
          <AssignDialog
            counselSessionId={params.row.counselSessionId}
            counselorId={params.row.counselorId}
          />
        );
      },
    },
    {
      field: 'cardRecordStatus',
      headerName: '기초 설문',
      flex: 1,
      renderCell: (params) => {
        const recordStatus = params.value;
        const counselSessionId = params.row.counselSessionId;
        return (
          <SurveyDialog
            counselSessionId={counselSessionId}
            dialogState={recordStatus}
          />
        );
      },
    },
  ];

  return columns;
};
