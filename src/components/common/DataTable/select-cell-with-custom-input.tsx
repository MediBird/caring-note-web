import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

interface SelectCellProps {
  initialValue: string;
  options: { label: string; value: string }[];
  placeholder: string;
  onValueChange: (value: string) => void;
}

function SelectCellWithCustomInput({
  initialValue,
  options,
  placeholder,
  onValueChange,
}: SelectCellProps) {
  const hasCustomInitialValue = useMemo(
    () => initialValue && !options.some((opt) => opt.value === initialValue),
    [initialValue, options],
  );

  const [customValue, setCustomValue] = useState(
    hasCustomInitialValue ? initialValue : '',
  );

  return (
    <div className="flex flex-col gap-1">
      <Select value={initialValue} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            'cursor-pointer border-none text-md bg-transparent data-[state=open]:shadow-cell-shadow focus:outline-none',
            initialValue === '' && 'text-grayscale-40',
          )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-md">
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
          <div className="px-2 py-1.5">
            <input
              type="text"
              value={customValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  onValueChange(customValue);
                }
              }}
              onChange={(e) => {
                e.stopPropagation();
                const newValue = e.target.value;
                setCustomValue(newValue);
              }}
              onBlur={() => {
                onValueChange(customValue);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full focus:outline-none border-b border-grayscale-30"
              placeholder="기타 입력"
            />
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectCellWithCustomInput;
