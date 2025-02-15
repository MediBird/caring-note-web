import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
          className={`cursor-pointer border-none text-md bg-transparent data-[state=open]:shadow-cell-shadow focus:outline-none ${
            initialValue === '' && 'text-grayscale-40'
          }`}>
          <SelectValue placeholder={placeholder} className="cursor-pointer" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-md cursor-pointer">
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
