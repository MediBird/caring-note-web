import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useState } from 'react';

interface TableFilterOption {
  label: string;
  value: string;
  count?: number;
}

interface TableFilterProps {
  options: TableFilterOption[];
  onSelectionChange: (selectedValues: string[]) => void;
  placeholder?: string;
}

const TableFilter = ({
  options,
  onSelectionChange,
  placeholder = '',
}: TableFilterProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelectedValues);
    onSelectionChange(newSelectedValues);
  };

  return (
    <Command className="rounded-lg border">
      <CommandInput
        placeholder={placeholder}
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList>
        <CommandGroup>
          {filteredOptions.map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => handleSelect(option.value)}
              className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  readOnly
                  className="h-4 w-4"
                />
                <span>{option.label}</span>
              </div>
              {option.count !== undefined && (
                <span className="text-sm text-gray-500">{option.count}</span>
              )}
            </CommandItem>
          ))}
          {filteredOptions.length === 0 && (
            <div className="py-2 px-4 text-sm text-gray-500">
              검색 결과가 없습니다
            </div>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default TableFilter;
