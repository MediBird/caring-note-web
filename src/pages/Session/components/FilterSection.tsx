import TableFilter from '@/components/common/DataTable/table-filter';
import TableFilterDate from '@/components/common/DataTable/table-filter-date';
import { SearchInput } from '@/components/common/search-input';
import { useCounselActiveDate } from '@/pages/Home/hooks/query/useCounselActiveDate';
import { useCallback, useEffect, useState } from 'react';
import { useCounselorList } from '../hooks/query/useCounselSessionQuery';
import {
  useCounselSessionParamsStore,
  useSessionDateStore,
} from '../hooks/store/useCounselSessionStore';
import { CreateReservationDialog } from './dialog/CreateReservationDialog';
import {
  COUNSEL_SESSION_STATUS_LABELS,
  SearchCounselSessionsStatusesEnum,
} from '@/constants/counselSessionConstants';
import { GetCounselorResRoleTypeEnum } from '@/api';
import { useAuthContext } from '@/context/AuthContext';

export const FilterSection = () => {
  // 스토어와 데이터
  const { params, setParams } = useCounselSessionParamsStore();
  const { dates, setDates, year, month, setYearMonth } = useSessionDateStore();
  const { data: counselorNames = [] } = useCounselorList();
  const selectedCounselors = params.counselorNames || [];
  const selectedStatuses = params.statuses || [];
  const { user } = useAuthContext();

  // 입력 오류 표시 상태
  const [keywordError, setKeywordError] = useState<string | null>(null);

  // 날짜 관련 설정
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  useEffect(() => {
    setYearMonth(currentYear, currentMonth);
  }, [setYearMonth, currentYear, currentMonth]);

  const { data: activeDates } = useCounselActiveDate({
    year,
    month,
    userType: GetCounselorResRoleTypeEnum.User,
  });

  /**
   * 키워드가 유효한지 검증하는 함수
   */
  const isValidKeyword = useCallback((keyword: string): boolean => {
    if (!keyword) return true; // 빈 문자열은 유효함

    // 한글 또는 영문 문자만 허용
    const validPattern = /^[가-힣a-zA-Z]+$/;
    return validPattern.test(keyword);
  }, []);

  // 이름 필터 변경 핸들러
  const handleNameFilterChange = (value: string) => {
    // 키워드 유효성 검사 (UI 피드백용)
    if (value && !isValidKeyword(value)) {
      setKeywordError('검색어는 한글 또는 영문 문자만 입력 가능합니다.');
    } else {
      setKeywordError(null);
    }

    // 파라미터 업데이트 (항상 실행) - 페이지 리셋 추가
    setParams({ counseleeNameKeyword: value, page: 0 });
  };

  // 상담사 필터 변경 핸들러
  const handleCounselorFilterChange = (selectedCounselors: string[]) => {
    setParams({
      counselorNames:
        selectedCounselors.length > 0 ? selectedCounselors : undefined,
      page: 0, // 페이지 리셋
    });
  };

  // 날짜 필터 변경 핸들러
  const handleDateFilterChange = (selectedDates: Date[]) => {
    const formattedDates = selectedDates.map(
      (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(date.getDate()).padStart(2, '0')}`,
    );

    setDates(formattedDates);
    setParams({
      scheduledDates: formattedDates.length > 0 ? formattedDates : undefined,
      page: 0, // 페이지 리셋
    });
  };

  // 상담 상태 필터 변경 핸들러
  const handleStatusFilterChange = (selectedValues: string[]) => {
    setParams({
      statuses:
        selectedValues.length > 0
          ? (selectedValues as SearchCounselSessionsStatusesEnum[])
          : undefined,
      page: 0, // 페이지 리셋
    });
  };

  // 현재 선택된 날짜를 Date 객체로 변환
  const selectedDatesAsDateObjects = dates.map((dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  });

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <SearchInput
              value={params.counseleeNameKeyword || ''}
              onChange={handleNameFilterChange}
            />
            {keywordError && (
              <span className="mt-1 text-xs text-red-500">{keywordError}</span>
            )}
          </div>
          <TableFilter
            title="담당 약사"
            options={counselorNames.map((counselorName: string) => ({
              label: counselorName,
              value: counselorName,
            }))}
            onSelectionChange={handleCounselorFilterChange}
            selectedValues={selectedCounselors}
          />
          <TableFilterDate
            title="상담 일자"
            onSelectionChange={handleDateFilterChange}
            selectedDates={selectedDatesAsDateObjects}
            enabledDates={activeDates}
          />
          <TableFilter
            title="상담 상태"
            options={Object.values(SearchCounselSessionsStatusesEnum).map(
              (status) => ({
                label: COUNSEL_SESSION_STATUS_LABELS[status] || status,
                value: status,
              }),
            )}
            onSelectionChange={handleStatusFilterChange}
            selectedValues={selectedStatuses}
          />
        </div>

        {user?.roleType === GetCounselorResRoleTypeEnum.Admin && (
          <CreateReservationDialog />
        )}
      </div>
    </div>
  );
};
