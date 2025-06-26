import timeStats from '@/assets/home/times-stats.webp';
import doneStats from '@/assets/home/done-stats.webp';
import counseleeStats from '@/assets/home/counselee-stats.webp';
import contributerStats from '@/assets/home/message-stats.webp';

import ConsultCount from './ConsultCount';
import { useSessionStatsQuery } from '../hooks/query/useSessionStatsQuery';
import { useSessionStatsStore } from '../hooks/useSessionStatsStore';

function MeaningfulStatistics() {
  const { data, isLoading, error } = useSessionStatsStore();

  // React Query 훅 호출 - 자동으로 데이터를 가져옴
  useSessionStatsQuery();

  // 로딩 중이거나 데이터가 없을 때의 기본값
  const stats = {
    counselHours: data?.counselHoursThisMonth ?? 0,
    counseleeCount: data?.counseleeCountForThisMonth ?? 0,
    totalSessions: data?.medicationCounselCountThisYear ?? 0,
    caringMessages: data?.counselorCountThisYear ?? 0,
  };

  return (
    <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-container">
      <span className="text-xl font-bold leading-[26px] text-primary-50">
        약으로 이어지는 <br className="hidden hd:block" /> 건강한 변화들 💫
      </span>
      <p className="mb-[10px] mt-1.5 text-caption1 leading-[14px] text-grayscale-50">
        오늘 기준
        {error && <span className="ml-2 text-red-500">데이터 로딩 실패</span>}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ConsultCount
          count={stats.counselHours}
          unit="시간"
          title="이번달 내담자와 <br /> 상담해온 시간"
          image={timeStats}
          backgroundColor="linear-gradient(90deg, rgba(230, 132, 5, 0.15) 0%, rgba(255, 202, 68, 0.15) 100%)"
          isLoading={isLoading}
        />
        <ConsultCount
          count={stats.counseleeCount}
          unit="명"
          title="이번 달 상담소를  <br />  찾아주신 내담자"
          image={counseleeStats}
          backgroundColor="linear-gradient(180deg, rgba(255, 174, 166, 0.2) 0%, rgba(255, 218, 214, 0.2) 100%)"
          isLoading={isLoading}
        />
        <ConsultCount
          count={stats.totalSessions}
          unit="건"
          title="복약 상담으로 <br /> 이어진 돌봄 횟수"
          image={doneStats}
          backgroundColor="linear-gradient(180deg, rgba(119, 182, 255, 0.2) 0%, rgba(37, 138, 255, 0.2) 100%)"
          isLoading={isLoading}
        />
        <ConsultCount
          count={stats.caringMessages}
          unit="명"
          title="케어링 노트와 <br /> 함께 해온 사람"
          image={contributerStats}
          backgroundColor="linear-gradient(90deg, rgba(230, 132, 5, 0.15) 0%, rgba(255, 202, 68, 0.15) 100%)"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default MeaningfulStatistics;
