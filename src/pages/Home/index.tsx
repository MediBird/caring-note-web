import { GetCounselorResRoleTypeEnum } from '@/api';
import background from '@/assets/home/home-bg.webp';
import logoWide from '@/assets/home/logo-wide.webp';
import tableEmpty from '@/assets/home/table-empty.webp';
import CalendarIcon from '@/assets/icon/calendar.svg?react';
import onlypc from '@/assets/illusts/onlypc.webp';
import Spinner from '@/components/common/Spinner';
import DatePickerComponent from '@/components/ui/datepicker';
import { useAuthContext } from '@/context/AuthContext';
import { useCounselActiveDate } from './hooks/query/useCounselActiveDate';
import CollegeMessages from '@/pages/Home/components/CollegeMessages';
import ConsultCountContainer from '@/pages/Home/components/MeaningfulStatistics';
import TodayScheduleTable from '@/pages/Home/components/TodayScheduleTable';
import { useHomeDateStore } from './hooks/useHomeDateStore';
import { cn } from '@/lib/utils';
import MeaningfulStatistics from '@/pages/Home/components/MeaningfulStatistics';
import { MyProfileDialog } from '@/components/common/MyProfileDialog';

function Home() {
  const { selectedDate, selectedMonth, setSelectedDate, setSelectedMonth } =
    useHomeDateStore();
  const { user } = useAuthContext();

  const { data: counselActiveDate, isLoading: isCounselActiveDateLoading } =
    useCounselActiveDate({
      year: selectedMonth.getFullYear(),
      month: selectedMonth.getMonth() + 1,
      userType: user?.roleType as GetCounselorResRoleTypeEnum,
    });

  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="h-full bg-cover bg-center bg-no-repeat">
      <div className="mx-auto flex h-full max-w-layout flex-col items-center justify-start px-layout pb-6 pt-[40px] [&>*]:max-w-content">
        <div className="flex w-full items-center justify-between">
          <img src={logoWide} alt="logo" width={310} />
          <div className="flex items-center gap-4 font-medium text-primary-50">
            <MyProfileDialog>
              <button className="border-b-2 border-primary-50">내 정보</button>
            </MyProfileDialog>
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
                <span className="text-subtitle1 font-bold">상담 일정</span>
                {user &&
                  (user.roleType === GetCounselorResRoleTypeEnum.Admin ||
                    user.roleType === GetCounselorResRoleTypeEnum.User) && (
                    <DatePickerComponent
                      activeAllDates={false}
                      isLoading={isCounselActiveDateLoading}
                      trigger={
                        <button
                          className={cn(
                            'flex items-center gap-0.5 px-2 text-right text-body1 font-semibold',
                          )}>
                          <CalendarIcon />
                          날짜 선택
                        </button>
                      }
                      initialDate={selectedDate}
                      selectedMonth={selectedMonth}
                      onMonthChange={(month) => setSelectedMonth(month as Date)}
                      handleClicked={(date?: Date) => {
                        setSelectedDate(date ?? new Date());
                      }}
                      enabledDates={counselActiveDate ?? []}
                    />
                  )}
              </div>
              <div className="flex flex-1 flex-col items-center justify-start">
                {user && user.roleType === GetCounselorResRoleTypeEnum.None && (
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <img
                      src={onlypc}
                      alt="onlypc-empty"
                      width={180}
                      height={180}
                    />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">
                        관리자 승인을 기다리고있어요
                      </span>
                      <span className="text-base text-gray-500">
                        요청이 승인되면 상담 일정을 확인할 수 있어요!
                      </span>
                    </div>
                  </div>
                )}
                {user &&
                  user.roleType !== GetCounselorResRoleTypeEnum.None &&
                  !counselActiveDate &&
                  isCounselActiveDateLoading && (
                    <div className="flex flex-1 flex-col items-center justify-center">
                      <img src={tableEmpty} alt="table-empty" />
                      <span className="text-2xl font-bold">
                        오늘은 예정된 상담 일정이 없어요
                      </span>
                      <span className="text-base text-gray-500">
                        상담 내역에서 이전 상담 기록을 볼 수 있습니다
                      </span>
                    </div>
                  )}

                {user &&
                  user.roleType !== GetCounselorResRoleTypeEnum.None &&
                  isCounselActiveDateLoading && (
                    <div className="flex flex-1 flex-col items-center justify-center">
                      <Spinner className="h-10 w-10" />
                    </div>
                  )}

                {user && user.roleType !== GetCounselorResRoleTypeEnum.None && (
                  <TodayScheduleTable />
                )}
              </div>
            </div>
          </div>
          {/* min-width 1440px 이하 */}
          <div className="flex w-full flex-col justify-center gap-4 hd:hidden">
            <MeaningfulStatistics />
            <CollegeMessages />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
