import { SelectCounselSessionListItem } from '@/api/api';
import CollegeMessage from '@/components/CollegeMessage';
import ConsultCount from '@/components/ConsultCount';
import { useAuthContext } from '@/context/AuthContext';
import { useSelectCounselSessionList } from '@/hooks/useCounselSessionQuery';
import { useMemo } from 'react';

import TodayScheduleTable from '@/pages/Home/components/TodayScheduleTable';

function Home() {
  const { user } = useAuthContext();

  const { data: counselList } = useSelectCounselSessionList({
    size: 15,
  });

  const formattedCounselList = useMemo(() => {
    return counselList?.map((item: SelectCounselSessionListItem) => {
      return {
        ...item,
        id: item.counselSessionId,
      };
    });
  }, [counselList]);

  return (
    <>
      <div className="flex flex-col items-center justify-start h-full bg-gray-50">
        <div className="w-full font-bold text-h3 text-primary-80 pl-20 pt-[9.25rem] pb-6 bg-primary-30">
          {`${user?.name ?? ''}님,`.replace(/\s/g, '')}
          <br />
          오늘도 힘찬 하루를 보내세요!
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-8 mt-8 2xl:items-start 2xl:flex-row px-10 pb-10">
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
            <CollegeMessage message="약대 입학 후 얼마 안 되었을 때, 더 나은 사회를 위해 같이 공부하고 행동해 보자는 글귀를 읽고 가입하기로 마음먹었어요." />
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
                <span className="text-2xl font-bold">오늘 일정</span>
              </div>
              <div className="mt-5">
                <TodayScheduleTable counselList={formattedCounselList ?? []} />
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
