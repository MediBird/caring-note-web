import { format } from 'date-fns';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Dispatch, useMemo, useCallback } from 'react';
import { SetStateAction } from 'react';
import Spinner from '@/components/common/Spinner';

export interface DatePickerProps {
  placeholder?: string;
  className?: string;
  initialDate?: Date;
  trigger?: React.ReactNode;
  handleClicked?: (date?: Date) => void;
  enabledDates?: string[];
  selectedMonth?: Date;
  onMonthChange?: Dispatch<SetStateAction<Date>>;
  isLoading?: boolean;
}

export function DatePickerComponent({
  placeholder,
  className,
  initialDate,
  trigger,
  handleClicked,
  enabledDates,
  selectedMonth,
  onMonthChange,
  isLoading = false,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [isOpen, setIsOpen] = React.useState(false); // Popover 열림 상태 관리

  // date가 변경될 때만 handleClicked를 호출하도록 수정
  const handleDateSelect = React.useCallback(
    (newDate: Date | undefined) => {
      setDate(newDate);
      handleClicked?.(newDate);
      setIsOpen(false);
    },
    [handleClicked],
  );

  const enabledDatesSet = useMemo(
    () => new Set(enabledDates || []),
    [enabledDates],
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      return !enabledDatesSet.has(formattedDate);
    },
    [enabledDatesSet],
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger ? (
          React.cloneElement(trigger as React.ReactElement, {
            className: cn(
              (trigger as React.ReactElement).props.className,
              isOpen && '!text-primary-50',
            ),
          })
        ) : (
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] h-[2.25rem] justify-start border-none items-center text-left font-normal bg-transparent hover:bg-transparent text-base',
              !date && 'text-muted-foreground',
              isOpen && '!text-primary-50',
              className,
            )}>
            {date ? (
              format(date, 'yyyy-MM-dd')
            ) : (
              <span>{placeholder ? placeholder : '날짜 및 시간 선택'}</span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="end" side="bottom">
        {isLoading ? (
          <div className="flex items-center justify-center h-[289px] w-[252px]">
            <Spinner className="w-6 h-6" />
          </div>
        ) : (
          <Calendar
            mode="single"
            captionLayout="dropdown-buttons"
            showOutsideDays={true}
            selected={date}
            onSelect={handleDateSelect}
            fromYear={1960}
            toYear={2050}
            initialFocus
            month={selectedMonth}
            onMonthChange={onMonthChange}
            disabled={isDateDisabled}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
export default DatePickerComponent;
