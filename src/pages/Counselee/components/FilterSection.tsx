import TableFilter from '@/components/common/DataTable/table-filter';
import { SearchInput } from '../../../components/common/search-input';

interface FilterSectionProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  birthDatesFilter: string[];
  setBirthDatesFilter: (value: string[]) => void;
  institutionsFilter: string[];
  setInstitutionsFilter: (value: string[]) => void;
  birthDatesOptions: { label: string; value: string }[];
  institutionsOptions: { label: string; value: string }[];
}

export const FilterSection = ({
  nameFilter,
  setNameFilter,
  birthDatesFilter,
  setBirthDatesFilter,
  institutionsFilter,
  setInstitutionsFilter,
  birthDatesOptions,
  institutionsOptions,
}: FilterSectionProps) => {
  return (
    <div className="flex items-center gap-4">
      <SearchInput value={nameFilter} onChange={setNameFilter} />
      <TableFilter
        title="생년월일"
        options={birthDatesOptions}
        onSelectionChange={setBirthDatesFilter}
        selectedValues={birthDatesFilter}
      />
      <TableFilter
        title="연계기관"
        options={institutionsOptions}
        onSelectionChange={setInstitutionsFilter}
        selectedValues={institutionsFilter}
      />
    </div>
  );
};
