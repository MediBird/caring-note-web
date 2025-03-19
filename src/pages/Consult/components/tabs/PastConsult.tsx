import PastConsultContainer from '@/components/consult/PastConsultContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import PrevCounselTable from '@/pages/Consult/components/table/PrevCounselTable';
import { usePrevMedicationCounsel } from '@/pages/Consult/hooks/query/usePrevMedicationCounsel';

import React from 'react';
import { useParams } from 'react-router-dom';

const PastConsult: React.FC = () => {
  const { counselSessionId } = useParams();

  const { prevMedicationCounsel } = usePrevMedicationCounsel(counselSessionId);

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

        <PastConsultContainer title="상담노트 요약" variant="secondary">
          <h2 className="flex items-center text-subtitle2 font-bold text-secondary-70"></h2>
          <p className="mt-4 whitespace-pre-wrap">
            {prevMedicationCounsel?.counselNoteSummary}
          </p>
        </PastConsultContainer>
      </div>

      <CardHeader>
        <CardTitle>이전 상담 자세히 보기</CardTitle>
        <p className="!mt-0 text-body1 font-medium text-grayscale-70">
          케어링 노트로 남긴 이전 회차 상담 목록
        </p>
      </CardHeader>
      <div className="h-auto">
        <PrevCounselTable />
      </div>
    </Card>
  );
};

export default PastConsult;
