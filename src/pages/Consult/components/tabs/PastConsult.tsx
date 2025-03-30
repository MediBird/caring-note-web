import PastConsultContainer from '@/components/consult/PastConsultContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import PrevCounselTable from '@/pages/Consult/components/table/PrevCounselTable';
import { usePrevMedicationCounsel } from '@/pages/Consult/hooks/query/usePrevMedicationCounsel';
import {
  PrevCounselSessionListDTO,
  usePrevCounselSessionList,
} from '@/pages/Consult/hooks/query/usePrevCounselSessionList';
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAiSummaryQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetAiSummaryQuery';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import ReactMarkdown from 'react-markdown';
const PastConsult: React.FC = () => {
  const navigate = useNavigate();

  const { counselSessionId } = useParams();

  const { prevMedicationCounsel } = usePrevMedicationCounsel(
    counselSessionId ?? '',
  );
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
        <PastConsultContainer title="상담 기록 하이라이트" variant="primary">
          <ul className="mt-4 space-y-2 text-body1 font-medium">
            {prevMedicationCounsel?.counselRecordHighlights?.map(
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
