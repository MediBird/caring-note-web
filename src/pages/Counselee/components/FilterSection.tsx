import TableFilter from '@/components/common/DataTable/table-filter';
import { SearchInput } from './SearchInput';

interface FilterSectionProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  handleSearch: () => void;
  birthDatesFilter: string[];
  setBirthDatesFilter: (value: string[]) => void;
  institutionsFilter: string[];
  setInstitutionsFilter: (value: string[]) => void;
  birthDatesOptions: { label: string; value: string }[];
  institutionsOptions: { label: string; value: string }[];
  onBirthDatesClick: () => void;
  onInstitutionsClick: () => void;
}

export const FilterSection = ({
  nameFilter,
  setNameFilter,
  handleSearch,
  birthDatesFilter,
  setBirthDatesFilter,
  institutionsFilter,
  setInstitutionsFilter,
  birthDatesOptions,
  institutionsOptions,
  onBirthDatesClick,
  onInstitutionsClick,
}: FilterSectionProps) => {
  return (
    <div className="flex gap-4 items-center">
      <SearchInput
        value={nameFilter}
        onChange={setNameFilter}
        onSearch={handleSearch}
      />
      <TableFilter
        title="생년월일"
        options={birthDatesOptions}
        onSelectionChange={setBirthDatesFilter}
        onOpen={onBirthDatesClick}
        selectedValues={birthDatesFilter}
      />
      <TableFilter
        title="연계기관"
        options={institutionsOptions}
        onSelectionChange={setInstitutionsFilter}
        onOpen={onInstitutionsClick}
        selectedValues={institutionsFilter}
      />
    </div>
  );
};
