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
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

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
  disableFutureDates?: boolean;
  isPrescriptionDate?: boolean;
  isDateUnknown?: boolean;
  handleDateUnknown?: () => void;
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
  disableFutureDates = false,
  isPrescriptionDate = false,
  isDateUnknown = false,
  handleDateUnknown,
}: DatePickerProps) {
  const [month, setMonth] = useState<Date | undefined>(selectedMonth);

  const [date, setDate] = useState<Date | undefined>(initialDate);

  const [isUnknown, setIsUnknown] = useState(isDateUnknown);

  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = useCallback(
    (newDate: Date | undefined) => {
      if (newDate) {
        const adjustedDate = new Date(
          Date.UTC(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
            0,
            0,
            0,
            0,
          ),
        );

        setDate(adjustedDate);
        handleClicked?.(adjustedDate);
      } else {
        setDate(newDate);
        handleClicked?.(newDate);
      }
      setIsOpen(false);
      setIsUnknown(false);
    },
    [handleClicked],
  );

  const handleDateUnknownClick = useCallback(() => {
    setIsUnknown(true);
    handleDateUnknown?.();
    setIsOpen(false);
  }, [handleDateUnknown]);

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

      if (disableFutureDates) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (date > today) {
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
    [enabledDatesSet, activeAllDates, disablePastDates, disableFutureDates],
  );

  const getDateText = () => {
    if (isUnknown) {
      return '처방날짜 모름';
    }
    return date ? (
      format(date, 'yyyy-MM-dd')
    ) : (
      <span className="text-base text-grayscale-30">
        {placeholder ? placeholder : '날짜 및 시간 선택'}
      </span>
    );
  };

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
              'h-full w-[280px] items-center justify-start border-transparent bg-transparent text-left !text-base font-normal hover:bg-transparent',
              !date && 'text-muted-foreground',
              isOpen && 'text-primary-50',
              showBorderWithOpen &&
                isOpen &&
                '!border-primary-50 ring-1 ring-primary-50',
              className,
            )}>
            {getDateText()}
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
        {isPrescriptionDate && (
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={handleDateUnknownClick}>
            처방날짜 모름
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
export default DatePickerComponent;
