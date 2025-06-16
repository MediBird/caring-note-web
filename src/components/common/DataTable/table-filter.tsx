import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TableFilterOption {
  label: string;
  value: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TableFilterProps {
  title: string;
  options: TableFilterOption[];
  onSelectionChange: (values: string[]) => void;
  selectedValues?: string[];
}

// 초성 추출 함수
const getInitialConsonants = (str: string) => {
  const initialConsonants = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];

  return str
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0) - 0xac00;
      if (code > -1 && code < 11172) {
        return initialConsonants[Math.floor(code / 588)];
      }
      return char;
    })
    .join('');
};

const TableFilter = ({
  title,
  options,
  onSelectionChange,
  selectedValues: externalSelectedValues,
}: TableFilterProps) => {
  const [open, setOpen] = useState(false);
  const [tempSelectedValues, setTempSelectedValues] = useState<string[]>(
    externalSelectedValues || [],
  );
  const [selectedValues, setSelectedValues] = useState<string[]>(
    externalSelectedValues || [],
  );
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setSelectedValues(externalSelectedValues || []);
    setTempSelectedValues(externalSelectedValues || []);
  }, [externalSelectedValues]);

  const normalizeString = (str: string) => {
    return str.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
  };

  const filteredOptions = options.filter((option) => {
    const normalizedLabel = normalizeString(option.label);
    const normalizedSearch = normalizeString(searchValue);

    // 일반 검색
    if (normalizedLabel.includes(normalizedSearch)) {
      return true;
    }

    // 초성 검색
    const labelInitials = getInitialConsonants(normalizedLabel);
    const searchInitials = getInitialConsonants(normalizedSearch);
    return labelInitials.includes(searchInitials);
  });

  const handleSelect = (value: string) => {
    setTempSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTempSelectedValues(selectedValues);
    } else {
      setSelectedValues(tempSelectedValues);
      onSelectionChange(tempSelectedValues);
      setSearchValue('');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleClear = () => {
    setTempSelectedValues([]);
    setSelectedValues([]);
    onSelectionChange([]);
    setSearchValue('');
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  );

  const renderSelectedContent = () => {
    if (selectedValues.length === 0) return null;
    if (selectedValues.length > 2) {
      return <Badge variant="secondary">{selectedValues.length}개 선택</Badge>;
    }
    return selectedOptions.map((option) => (
      <Badge key={option.value} variant="secondary">
        {option.label}
      </Badge>
    ));
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={open ? 'tertiary' : 'outline'}
          role="combobox"
          size="lg"
          aria-expanded={open}
          className="flex items-center gap-2">
          <ChevronDown className="h-4 w-4" />
          <span>{title}</span>
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex gap-1">{renderSelectedContent()}</div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={title}
            value={searchValue}
            onValueChange={handleSearchChange}
          />
          <div className="flex flex-col">
            <CommandList className="max-h-[200px] overflow-auto">
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={tempSelectedValues.includes(option.value)}
                          readOnly
                          className="h-4 w-4"
                        />
                        <span>{option.label}</span>
                      </div>
                      {option.count !== undefined && (
                        <span className="ml-auto text-xs text-gray-500">
                          {option.count}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {filteredOptions.length === 0 && (
                <CommandGroup>
                  <CommandItem className="py-2 text-sm text-gray-500">
                    검색 결과가 없습니다
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>

            {selectedValues.length > 0 && (
              <div className="border-t border-gray-100">
                <CommandItem
                  onSelect={handleClear}
                  className="justify-center py-2 text-sm">
                  필터 초기화
                </CommandItem>
              </div>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TableFilter;
