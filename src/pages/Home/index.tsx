import { SelectCounselSessionListItem } from '@/api/api';
import background from '@/assets/home/home-bg.webp';
import logoWide from '@/assets/home/logo-wide.webp';
import tableEmpty from '@/assets/home/table-empty.webp';
import CalendarIcon from '@/assets/icon/calendar.svg?react';
import DatePickerComponent from '@/components/ui/datepicker';
import { useSelectCounselSessionList } from '@/hooks/useCounselSessionQuery';
import { cn } from '@/lib/utils';
import CollegeMessages from '@/pages/Home/components/CollegeMessages';
import ConsultCountContainer from '@/pages/Home/components/ConsultCountContainer';
import TodayScheduleTable from '@/pages/Home/components/TodayScheduleTable';
import { formatDateToHyphen } from '@/utils/formatDateToHyphen';
import { addMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import { useCounselActiveDate } from './hooks/query/useCounselActiveDate';

function Home() {
  const today = new Date();

  const thisMonth = addMonths(today, 0);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(thisMonth);

  const { data: counselList } = useSelectCounselSessionList({
    baseDate: formatDateToHyphen(selectedDate),
  });

  const { data: counselActiveDate, isLoading: isCounselActiveDateLoading } =
    useCounselActiveDate({
      year: selectedMonth.getFullYear(),
      month: selectedMonth.getMonth() + 1,
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
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="bg-cover bg-center bg-no-repeat h-full">
      <div className="flex flex-col items-center justify-start h-full pt-[40px] pb-6 max-w-layout mx-auto px-layout [&>*]:max-w-content">
        <div className="w-full flex justify-between items-center">
          <img src={logoWide} alt="logo" width={310} />
          <div className="flex items-center gap-4 text-primary-50 font-medium">
            <a className="border-b-2 border-primary-50" href="/">
              내 정보
            </a>
            <a
              className="border-b-2 border-primary-50"
              href="https://withnp.campaignus.me/"
              target="_blank">
              늘픔가치 바로가기
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between w-full gap-6 mt-3 hd:items-start hd:flex-row pb-10">
          {/* min-width 1440px 이상 */}
          <div className="flex-col gap-4 hidden hd:flex w-full max-w-[314px]">
            <ConsultCountContainer />
            <CollegeMessages />
          </div>
          <div className="flex flex-col items-center justify-center flex-grow w-full ">
            <div className="w-full h-auto p-6 gap-6 bg-white rounded-xl shadow-container min-h-[824px] flex flex-col">
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl font-bold">상담 일정</span>
                <DatePickerComponent
                  isLoading={isCounselActiveDateLoading}
                  trigger={
                    <button
                      className={cn(
                        'text-right flex items-center gap-0.5 font-bold px-2',
                      )}>
                      <CalendarIcon />
                      날짜 선택
                    </button>
                  }
                  initialDate={selectedDate}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  handleClicked={(date?: Date) => {
                    setSelectedDate(date ?? new Date());
                  }}
                  enabledDates={counselActiveDate ?? []}
                />
              </div>
              <div className="flex flex-col items-center justify-start flex-1">
                {formattedCounselList?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1">
                    <img src={tableEmpty} alt="table-empty" />
                    <span className="text-2xl font-bold">
                      오늘은 예정된 상담 일정이 없어요
                    </span>
                    <span className="text-base text-gray-500">
                      상담 내역에서 이전 상담 기록을 볼 수 있습니다
                    </span>
                  </div>
                ) : (
                  <TodayScheduleTable
                    counselList={formattedCounselList ?? []}
                  />
                )}
              </div>
            </div>
          </div>
          {/* min-width 1440px 이하 */}
          <div className="flex flex-col gap-4 justify-center hd:hidden w-full">
            <ConsultCountContainer />
            <CollegeMessages />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
