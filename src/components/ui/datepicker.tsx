import { format } from 'date-fns';
import * as React from 'react';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

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
  showBorderWithOpen?: boolean;
  align?: 'start' | 'end';
  activeAllDates?: boolean;
  disablePastDates?: boolean;
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
  align = 'end',
  showBorderWithOpen = false,
  activeAllDates = true,
  disablePastDates = false,
}: DatePickerProps) {
  const [month, setMonth] = React.useState<Date | undefined>(selectedMonth);

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
      if (disablePastDates) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
          return true;
        }
      }

      if (enabledDatesSet.size === 0 && activeAllDates) {
        return false;
      }

      if (!activeAllDates && enabledDatesSet.size === 0) {
        return true;
      }

      const formattedDate = format(date, 'yyyy-MM-dd');
      return !enabledDatesSet.has(formattedDate);
    },
    [enabledDatesSet, activeAllDates, disablePastDates],
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        {trigger ? (
          React.cloneElement(trigger as React.ReactElement, {
            className: cn(
              (trigger as React.ReactElement).props.className,
              isOpen && 'text-primary-50',
              showBorderWithOpen && 'border-primary-50',
            ),
          })
        ) : (
          <Button
            variant="outline"
            className={cn(
              'h-full w-[280px] items-center justify-start border-transparent bg-transparent text-left text-base font-normal hover:bg-transparent',
              !date && 'text-muted-foreground',
              isOpen && 'text-primary-50',
              showBorderWithOpen &&
                isOpen &&
                '!border-primary-50 ring-1 ring-primary-50',
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
      <PopoverContent
        className="w-auto border-none !shadow-cell-shadow"
        align={align}
        side="bottom"
        onInteractOutside={(e) => {
          e.preventDefault();
          setIsOpen(false);
        }}
        onEscapeKeyDown={() => {
          setIsOpen(false);
        }}>
        {isLoading ? (
          <div className="flex min-h-[224px] min-w-[224px] items-center justify-center p-0">
            <Spinner className="h-6 w-6" />
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
            month={selectedMonth ? selectedMonth : month}
            onMonthChange={onMonthChange ? onMonthChange : setMonth}
            disabled={isDateDisabled}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
export default DatePickerComponent;
