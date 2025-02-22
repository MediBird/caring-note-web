import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  const [showAllBadges, setShowAllBadges] = useState(false);

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

  const handleRemoveFilter = (valueToRemove: string) => {
    const newSelectedValues = selectedValues.filter(
      (value) => value !== valueToRemove,
    );
    setSelectedValues(newSelectedValues);
    setTempSelectedValues(newSelectedValues);
    onSelectionChange(newSelectedValues);
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
  const hasMoreBadges = selectedOptions.length > 2;
  const visibleBadges = showAllBadges
    ? selectedOptions
    : selectedOptions.slice(0, 2);

  return (
    <div className="flex flex-wrap items-center gap-2 border rounded-md p-2">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {title}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={title}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
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
              {selectedValues.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleClear}
                      className="justify-center text-sm">
                      필터 초기화
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Separator orientation="vertical" className="h-6" />
          {visibleBadges.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="flex items-center gap-1">
              {option.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveFilter(option.value)}
              />
            </Badge>
          ))}
          {hasMoreBadges && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setShowAllBadges(!showAllBadges)}>
              {showAllBadges ? (
                <div className="flex items-center gap-1">
                  접기 <ChevronUp className="h-3 w-3" />
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  +{selectedOptions.length - 2}개 더보기{' '}
                  <ChevronDown className="h-3 w-3" />
                </div>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableFilter;
