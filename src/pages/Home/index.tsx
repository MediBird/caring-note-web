import { SelectCounselSessionListItem } from '@/api';
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
      className="h-full bg-cover bg-center bg-no-repeat">
      <div className="mx-auto flex h-full max-w-layout flex-col items-center justify-start px-layout pb-6 pt-[40px] [&>*]:max-w-content">
        <div className="flex w-full items-center justify-between">
          <img src={logoWide} alt="logo" width={310} />
          <div className="flex items-center gap-4 font-medium text-primary-50">
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
        <div className="mt-3 flex w-full flex-col items-center justify-between gap-6 pb-10 hd:flex-row hd:items-start">
          {/* min-width 1440px 이상 */}
          <div className="hidden w-full max-w-[314px] flex-col gap-4 hd:flex">
            <ConsultCountContainer />
            <CollegeMessages />
          </div>
          <div className="flex w-full flex-grow flex-col items-center justify-center">
            <div className="flex h-auto min-h-[824px] w-full flex-col gap-6 rounded-xl bg-white p-6 shadow-container">
              <div className="flex w-full items-center justify-between">
                <span className="text-2xl font-bold">상담 일정</span>
                <DatePickerComponent
                  activeAllDates={false}
                  isLoading={isCounselActiveDateLoading}
                  trigger={
                    <button
                      className={cn(
                        'flex items-center gap-0.5 px-2 text-right font-bold',
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
              <div className="flex flex-1 flex-col items-center justify-start">
                {formattedCounselList?.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center">
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
          <div className="flex w-full flex-col justify-center gap-4 hd:hidden">
            <ConsultCountContainer />
            <CollegeMessages />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
