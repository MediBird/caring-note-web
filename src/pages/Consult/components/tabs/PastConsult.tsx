import PastConsultContainer from '@/components/consult/PastConsultContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import PrevCounselTable from '@/pages/Consult/components/table/PrevCounselTable';
import {
  PrevCounselSessionListDTO,
  usePrevCounselSessionList,
} from '@/pages/Consult/hooks/query/usePrevCounselSessionList';
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAiSummaryQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetAiSummaryQuery';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import ReactMarkdown from 'react-markdown';
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

  const { data: aiSummary, isSuccess } = useGetAiSummaryQuery(
    prevCounselSessionId,
    RecordingStatus.AICompleted,
  );

  const { data: prevCounselRecord, isLoading: isPrevCounselRecordLoading } =
    useSelectMedicineConsult(prevCounselSessionId);

  const handleClickPrevCounselSession = (
    rowData: PrevCounselSessionListDTO,
  ) => {
    const prevCounselSessionId = rowData.counselSessionId ?? '';

    navigate(`/consult/${prevCounselSessionId}`);
  };

  const highlightList = useMemo((): string[] => {
    if (isPrevCounselRecordLoading) return [];

    const parsedPrevCounselRecord: {
      type: string;
      children: { text: string; bold?: boolean }[];
    }[] =
      prevCounselRecord?.counselRecord &&
      prevCounselRecord?.counselRecord !== ''
        ? JSON.parse(prevCounselRecord?.counselRecord)
        : [];

    const childrenList = parsedPrevCounselRecord.map((item) => {
      return item.children;
    });

    const highlightList = childrenList.map((item) => {
      const boldList = item.filter((item) => item.bold);

      return boldList.map((item) => item.text);
    });

    return highlightList.flat();
  }, [isPrevCounselRecordLoading, prevCounselRecord]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>지난번 상담에서의 핵심 내용</CardTitle>
      </CardHeader>
      <div className="flex flex-row items-start justify-between space-x-4">
        <PastConsultContainer title="상담 기록 하이라이트" variant="primary">
          <ul className="mt-4 space-y-2 text-body1 font-medium">
            {highlightList?.map((item, index) => {
              return (
                <li key={index} className="border-l-2 border-grayscale-10 pl-2">
                  {item}
                </li>
              );
            })}
          </ul>
        </PastConsultContainer>

        <PastConsultContainer title="AI 요약" variant="secondary">
          <h2 className="flex items-center py-3 text-subtitle2 font-bold text-secondary-70"></h2>

          {isSuccess && (
            <ReactMarkdown className={'prose'}>
              {aiSummary?.analysedText}
            </ReactMarkdown>
          )}
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
