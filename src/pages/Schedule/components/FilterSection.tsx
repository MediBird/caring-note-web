import { SearchInput } from '@/components/common/CounseleeSearchInput';
import TableFilter from '@/components/common/DataTable/table-filter';
import { useCounselActiveDate } from '@/pages/Home/hooks/query/useCounselActiveDate';
import { useState } from 'react';
import TableFilterDate from '../../../components/common/DataTable/table-filter-date';

interface FilterSectionProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  handleSearch: () => void;
  counselors: string[];
  setCounselors: (value: string[]) => void;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
}

export const FilterSection = ({
  nameFilter,
  setNameFilter,
  handleSearch,
  counselors,
  setCounselors,
  selectedDates,
  setSelectedDates,
}: FilterSectionProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 현재 달의 연도와 월 계산
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JavaScript에서 월은 0부터 시작

  // 상담 가능 날짜 데이터 가져오기
  const { data: activeDates, isLoading } = useCounselActiveDate({
    year: currentYear,
    month: currentMonth,
  });

  // 활성 날짜를 Date 객체 배열로 변환
  const activeDateObjects = activeDates.map(
    (dateString) => new Date(dateString),
  );

  return (
    <div className="flex gap-4 items-center">
      <SearchInput
        value={nameFilter}
        onChange={setNameFilter}
        onSearch={handleSearch}
      />
      <TableFilter
        title="담당 상담사"
        options={counselors.map((counselor) => ({
          label: counselor,
          value: counselor,
        }))}
        onSelectionChange={setCounselors}
        selectedValues={counselors}
      />
      <TableFilterDate
        title="날짜 필터"
        onSelectionChange={(dates) => setSelectedDates(dates)}
        selectedDates={selectedDates}
        enabledDates={activeDates}
      />
    </div>
  );
};
