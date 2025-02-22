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
import { useState } from 'react';

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
}

const TableFilter = ({
  title,
  options,
  onSelectionChange,
  onOpen,
}: TableFilterProps) => {
  const [open, setOpen] = useState(false);
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

  const handleClear = () => {
    setSelectedValues([]);
    onSelectionChange([]);
    setSearchValue('');
  };

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
    }
  };

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) {
          handleOpen();
        }
      }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="border-dashed border-2"
          role="combobox"
          aria-expanded={open}>
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
                        checked={selectedValues.includes(option.value)}
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
  );
};

export default TableFilter;
