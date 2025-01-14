import { AddCounselCardReqCardRecordStatusEnum } from '@/api/api';
import CollegeMessage from '@/components/CollegeMessage';
import TableComponent from '@/components/common/TableComponent';
import ConsultCount from '@/components/ConsultCount';
import { Button } from '@/components/ui/button';
import { useSelectCounselSessionList } from '@/hooks/useCounselSessionQuery';
import {
  createDefaultDateColumn,
  createDefaultStatusColumn,
  createDefaultTextColumn,
} from '@/utils/TableUtils';
import { GridColDef } from '@mui/x-data-grid';
import { useKeycloak } from '@react-keycloak/web';
import { useMemo } from 'react';

function Home() {
  const { keycloak } = useKeycloak();
  const { data: counselList, isLoading } = useSelectCounselSessionList({
    size: 15,
  });

  const formattedCounselList = useMemo(() => {
    return counselList?.map((item) => {
      return {
        ...item,
        id: item.counselSessionId,
      };
    });
  }, [counselList]);

  const handleClickAssignMe = () => {
    console.log('할당하기 버튼 클릭');
  };

  const handleClickCardRecord = () => {
    console.log('카드 작성 버튼 클릭');
  };

  const columns = getCardColumns({
    handleClickAssignMe,
    handleClickCardRecord,
  });
  return (
    <>
      <div className="flex flex-col h-full items-center justify-start bg-gray-50">
        <p className="w-full font-bold text-h3 text-primary-80 pl-20 pt-[148px] pb-6 bg-primary-30">
          {keycloak.tokenParsed?.family_name ?? ''}
          {keycloak.tokenParsed?.given_name ?? ''}님, <br />
          오늘도 힘찬 하루를 보내세요!
        </p>
        <div className="flex w-full gap-8 2xl:items-start mt-8 justify-center 2xl:flex-row flex-col items-center">
          <div className="hidden 2xl:flex 2xl:flex-col gap-5 2xl:items-center 2xl:justify-center w-[278px]">
            <ConsultCount
              messageCount="1,234회"
              patientCount="201명"
              date="2025-01-01"
            />
            <CollegeMessage message="" />
          </div>

          <div className="flex justify-center 2xl:hidden max-w-[1020px] w-full">
            <ConsultCount
              messageCount="1,234회"
              patientCount="201명"
              date="2025-01-01"
            />
          </div>
          <div className="flex flex-col items-center justify-center flex-grow w-full max-w-[1020px]">
            <div className="w-full h-auto p-6 bg-white rounded-xl shadow-container">
              <div className="flex items-center justify-between w-full h-10">
                <span className="font-bold text-h3">오늘의 상담 일정</span>
                <Button variant="secondary">전체 상담 노트 보기</Button>
              </div>
              <div className="mt-10">
                <TableComponent
                  tableKey="home-table"
                  rows={isLoading ? [] : formattedCounselList ?? []}
                  columns={columns}
                  checkboxSelection={false}
                  onUpdateCell={() => {}}
                  onRowSelectionModelChange={() => {}}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center 2xl:hidden max-w-[1020px] w-full">
            <CollegeMessage message="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

const getCardColumns = ({
  handleClickAssignMe,
  handleClickCardRecord,
}: {
  handleClickAssignMe: () => void;
  handleClickCardRecord: () => void;
}): GridColDef[] => {
  const columns: GridColDef[] = [
    {
      field: 'scheduledTime',
      headerName: '예약시간',
      flex: 1,
      maxWidth: 112,
    },
    {
      ...createDefaultDateColumn({
        field: 'scheduledDate',
        headerName: '상담일자',
      }),
    },
    {
      ...createDefaultStatusColumn({
        field: 'status',
        headerName: '상담진행',
      }),
    },
    {
      ...createDefaultTextColumn({
        field: 'counseleeName',
        headerName: '내담자',
      }),
    },
    {
      ...createDefaultTextColumn({
        field: 'counselorName',
        headerName: '담당약사',
      }),
    },
    {
      field: 'counselorAssign',
      headerName: '상담 할당',
      flex: 1,
      renderCell: (params) => {
        // TODO : 할당 여부에 따라 버튼 diable 처리 (아래는 임시 코드)
        return params.value ? (
          <Button variant={'secondary'}>할당 완료</Button>
        ) : (
          <Button variant={'primary'} onClick={handleClickAssignMe}>
            나에게 할당
          </Button>
        );
      },
    },
    {
      field: 'cardRecordStatus',
      headerName: '기초 상담 카드',
      flex: 1,
      renderCell: (params) => {
        const recordStatus = params.value;
        return AddCounselCardReqCardRecordStatusEnum.Recorded ===
          recordStatus ? (
          <Button variant={'secondary'} disabled>
            작성 완료
          </Button>
        ) : AddCounselCardReqCardRecordStatusEnum.Unrecorded ===
          recordStatus ? (
          <Button variant={'primary'} onClick={handleClickCardRecord}>
            카드 작성
          </Button>
        ) : (
          <Button variant={'secondary'} disabled>
            작성 중
          </Button>
        );
      },
    },
  ];

  return columns;
};
