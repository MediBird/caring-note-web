import TableFilter from '@/components/common/DataTable/table-filter';
import { SearchInput } from '@/components/common/search-input';
import { useCounseleeStore } from '../hooks/store/useCounseleeStore';
import {
  useBirthDatesQuery,
  useInstitutionsQuery,
} from '../hooks/query/useFilterOptionsQuery';
import { useCallback, useState } from 'react';

export const CounseleeFilterSection = () => {
  const { filters, setFilters } = useCounseleeStore();
  const { data: birthDateOptions = [] } = useBirthDatesQuery();
  const { data: institutionOptions = [] } = useInstitutionsQuery();

  const [nameKeyword, setNameKeyword] = useState(filters.name || '');
  const [keywordError, setKeywordError] = useState<string | null>(null);

  const isValidKeyword = useCallback((keyword: string): boolean => {
    if (!keyword) return true;
    const validPattern = /^[가-힣a-zA-Z]+$/;
    return validPattern.test(keyword);
  }, []);

  const handleNameFilterChange = (value: string) => {
    setNameKeyword(value);
    if (value && !isValidKeyword(value)) {
      setKeywordError('검색어는 한글 또는 영문 문자만 입력 가능합니다.');
    } else {
      setKeywordError(null);
      // 실제 스토어 업데이트는 검색 버튼 클릭 또는 onBlur 시 수행 (옵션)
      // 여기서는 즉시 업데이트
      setFilters({ name: value || undefined });
    }
  };

  const handleBirthDateFilterChange = (selectedValues: string[]) => {
    setFilters({
      birthDates: selectedValues.length > 0 ? selectedValues : undefined,
    });
  };

  const handleInstitutionFilterChange = (selectedValues: string[]) => {
    setFilters({
      affiliatedWelfareInstitutions:
        selectedValues.length > 0 ? selectedValues : undefined,
    });
  };

  return (
    <div className="flex w-full flex-col gap-2 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col">
          <SearchInput value={nameKeyword} onChange={handleNameFilterChange} />
          {keywordError && (
            <span className="mt-1 text-xs text-red-500">{keywordError}</span>
          )}
        </div>
        <TableFilter
          title="생년월일"
          options={birthDateOptions} // { label: string, value: string }[] 형태여야 함
          onSelectionChange={handleBirthDateFilterChange}
          selectedValues={filters.birthDates || []}
        />
        <TableFilter
          title="연계 기관"
          options={institutionOptions} // { label: string, value: string }[] 형태여야 함
          onSelectionChange={handleInstitutionFilterChange}
          selectedValues={filters.affiliatedWelfareInstitutions || []}
        />
        {/* TODO: 필요한 경우 필터 초기화 버튼 추가 */}
      </div>
    </div>
  );
};
