import PastConsultContainer from '@/components/consult/PastConsultContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import PrevCounselTable from '@/pages/Consult/components/table/PrevCounselTable';
import {
  PrevCounselSessionListDTO,
  usePrevCounselSessionList,
} from '@/pages/Consult/hooks/query/usePrevCounselSessionList';
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelectMedicineConsult } from '@/pages/Consult/hooks/query/useMedicineConsultQuery';

const PastConsult = () => {
  const navigate = useNavigate();

  const { counselSessionId } = useParams();

  const { prevCounselSessionList } = usePrevCounselSessionList(
    counselSessionId ?? '',
  );

  const prevCounselSessionId = useMemo(() => {
    if (prevCounselSessionList.length > 0) {
      return prevCounselSessionList[0]?.counselSessionId;
    }

    return '';
  }, [prevCounselSessionList]);

  const { data: prevCounselRecord, isLoading: isPrevCounselRecordLoading } =
    useSelectMedicineConsult(prevCounselSessionId);

  console.log(prevCounselRecord, 'prevCounselRecord');
  console.log(isPrevCounselRecordLoading, 'isPrevCounselRecordLoading');

  const handleClickPrevCounselSession = (
    rowData: PrevCounselSessionListDTO,
  ) => {
    const prevCounselSessionId = rowData.counselSessionId ?? '';

    navigate(`/consult/${prevCounselSessionId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>지난번 상담에서의 핵심 내용</CardTitle>
      </CardHeader>
      <div className="flex flex-row items-start justify-between space-x-4">
        <PastConsultContainer
          title="중재 기록"
          variant="primary"></PastConsultContainer>

        <PastConsultContainer title="AI 요약" variant="secondary">
          <h2 className="flex items-center py-3 text-subtitle2 font-bold text-secondary-70"></h2>
        </PastConsultContainer>
      </div>

      <CardHeader>
        <CardTitle>이전 상담 자세히 보기</CardTitle>
        <p className="!mt-0 text-body1 font-medium text-grayscale-70">
          케어링 노트로 남긴 이전 회차 상담 목록
        </p>
      </CardHeader>
      <div className="h-auto">
        <PrevCounselTable
          handleClickPrevCounselSession={handleClickPrevCounselSession}
        />
      </div>
    </Card>
  );
};

export default PastConsult;
