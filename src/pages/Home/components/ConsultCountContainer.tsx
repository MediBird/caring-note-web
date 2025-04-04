import timeStats from '@/assets/home/times-stats.webp';
import doneStats from '@/assets/home/done-stats.webp';
import counseleeStats from '@/assets/home/counselee-stats.webp';
import messageStats from '@/assets/home/message-stats.webp';

import ConsultCount from './ConsultCount';
function ConsultCountContainer() {
  return (
    <div className="flex flex-col w-full bg-white rounded-xl shadow-container p-4">
      <span className="text-xl font-bold text-primary-50 leading-[26px]">
        약으로 이어지는 <br className="hidden hd:block" /> 건강한 변화들 💫
      </span>
      <p className="text-caption1 mt-1.5 mb-[10px] text-grayscale-50 leading-[14px]">
        오늘 기준
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ConsultCount
          count={1234}
          unit="시간"
          title="이번달 내담자와 <br /> 상담해온 시간"
          image={timeStats}
          backgroundColor="linear-gradient(90deg, rgba(230, 132, 5, 0.15) 0%, rgba(255, 202, 68, 0.15) 100%)"
        />
        <ConsultCount
          count={1234}
          unit="명"
          title="이번 달 상담소를  <br />  찾아주신 내담자"
          image={counseleeStats}
          backgroundColor="linear-gradient(180deg, rgba(255, 174, 166, 0.2) 0%, rgba(255, 218, 214, 0.2) 100%)"
        />
        <ConsultCount
          count={1234}
          unit="회"
          title="복약 상담으로 <br /> 이어진 돌봄 횟수"
          image={doneStats}
          backgroundColor="linear-gradient(180deg, rgba(119, 182, 255, 0.2) 0%, rgba(37, 138, 255, 0.2) 100%)"
        />
        <ConsultCount
          count={1234}
          unit="건"
          title="연계 기관에 전달한 <br /> 메세지 건수"
          image={messageStats}
          backgroundColor="linear-gradient(90deg, rgba(230, 132, 5, 0.15) 0%, rgba(255, 202, 68, 0.15) 100%)"
        />
      </div>
    </div>
  );
}

export default ConsultCountContainer;
