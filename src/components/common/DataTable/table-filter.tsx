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
  onOpen?: () => void;
  selectedValues?: string[];
}

const TableFilter = ({
  title,
  options,
  onSelectionChange,
  onOpen,
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

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleSelect = (value: string) => {
    setTempSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      if (onOpen) onOpen();
      setTempSelectedValues(selectedValues);
    } else {
      setSelectedValues(tempSelectedValues);
      onSelectionChange(tempSelectedValues);
      setSearchValue('');
    }
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
            onValueChange={setSearchValue}
          />
          <div className="flex flex-col">
            <CommandList className="max-h-[200px] overflow-auto">
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}>
                    <div className="flex items-center justify-between w-full">
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
                  <CommandItem className="text-sm text-gray-500 py-2">
                    검색 결과가 없습니다
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
            
            {selectedValues.length > 0 && (
              <div className="border-t border-gray-100">
                <CommandItem
                  onSelect={handleClear}
                  className="justify-center text-sm py-2">
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
