import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { usePrevCounselSessionDetailList } from '@/pages/Consult/hooks/query/usePrevCounselSessionDetailList';
import SessionHeader from './components/SessionHeader';
import RecordCard from './components/RecordCard';

const PastConsult = () => {
  const { counselSessionId } = useParams();
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});

  const { prevCounselSessionDetailList, isLoading } =
    usePrevCounselSessionDetailList(counselSessionId ?? '', 0, 50);

  // 데이터 로드 완료 시 첫 번째 세션 자동 열기
  useEffect(() => {
    if (!isLoading && prevCounselSessionDetailList.length > 0) {
      const firstSessionId =
        prevCounselSessionDetailList[0].counselSessionId ?? '';
      if (firstSessionId) {
        setOpenSessions((prev) => ({
          ...prev,
          [firstSessionId]: true,
        }));
      }
    }
  }, [isLoading, prevCounselSessionDetailList]);

  const toggleSession = (sessionId: string) => {
    setOpenSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  const handleViewDetails = (sessionId: string) => {
    window.open(`/consult/${sessionId}`, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <Card className="bg-primary-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>이전 상담 히스토리</CardTitle>
          <p className="text-body2 font-normal text-grayscale-60">
            * [자세히 보러 가기] 클릭 시 해당 회차 페이지로 이동합니다.
          </p>
        </CardHeader>
        <div className="p-4">
          <div className="text-center">로딩 중...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>이전 상담 히스토리</CardTitle>
        <p className="text-body2 font-normal text-grayscale-60">
          * [자세히 보러 가기] 클릭 시 해당 회차 페이지로 이동합니다.
        </p>
      </CardHeader>

      <div className="space-y-4 pb-6">
        {prevCounselSessionDetailList.length === 0 ? (
          <div className="py-8 text-center text-grayscale-60">
            이전 상담 히스토리가 없습니다.
          </div>
        ) : (
          prevCounselSessionDetailList.map((session) => {
            const sessionId = session.counselSessionId ?? '';
            const isOpen = openSessions[sessionId] ?? false;

            return (
              <Collapsible
                key={sessionId}
                open={isOpen}
                className="w-full rounded-lg bg-primary-5 shadow-sm">
                <CollapsibleTrigger className="w-full">
                  <SessionHeader
                    sessionNumber={session.sessionNumber}
                    counselSessionDate={session.counselSessionDate}
                    counselorName={session.counselorName}
                    isOpen={isOpen}
                    onViewDetails={() => handleViewDetails(sessionId)}
                    onOpenChange={() => toggleSession(sessionId)}
                  />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="flex gap-6 px-4 pb-4">
                    <RecordCard
                      title="중재기록"
                      content={session.medicationCounselRecord}
                      emptyMessage="중재기록이 없습니다."
                      isLexical={true}
                    />
                    <RecordCard
                      title="AI 요약"
                      content={session.aiSummary}
                      emptyMessage="AI 요약이 없습니다."
                      isLexical={false}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default PastConsult;
