import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface SelectCellProps {
  initialValue: string;
  options: { label: string; value: string }[];
  placeholder: string;
  onValueChange: (value: string) => void;
}

function SelectCell({
  initialValue,
  options,
  placeholder,
  onValueChange,
}: SelectCellProps) {
  const hasCustomInitialValue = useMemo(
    () => initialValue && !options.some((opt) => opt.value === initialValue),
    [initialValue, options],
  );

  return (
    <div className="flex flex-col gap-1">
      <Select value={initialValue} onValueChange={onValueChange}>
        <SelectTrigger
          className={`text-md cursor-pointer border-none bg-transparent focus:outline-none data-[state=open]:shadow-cell-shadow ${
            initialValue === '' && 'text-grayscale-40'
          }`}>
          <SelectValue placeholder={placeholder} className="cursor-pointer" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                'text-md cursor-pointer',
                initialValue === option.value && '!text-primary-50',
              )}>
              {option.label}
            </SelectItem>
          ))}
          {hasCustomInitialValue && (
            <SelectItem
              key={initialValue}
              value={initialValue}
              className="hidden">
              {initialValue}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectCell;
