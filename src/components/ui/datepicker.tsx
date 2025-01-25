'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export interface DatePickerProps {
  placeholder?: string;
  className?: string;
  initialDate?: Date;
  handleClicked?: (date?: Date) => void;
}

export function DatePickerComponent({
  placeholder,
  className,
  initialDate,
  handleClicked,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [isOpen, setIsOpen] = React.useState(false); // Popover 열림 상태 관리

  useEffect(() => {
    handleClicked?.(date);
    setIsOpen(false);
  }, [date, handleClicked]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] h-[2.25rem] justify-start items-center text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}>
          <CalendarIcon className="w-4 h-4 mr-0" />
          {date ? (
            format(date, 'yyyy-MM-dd')
          ) : (
            <span>{placeholder ? placeholder : '날짜 및 시간 선택'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          showOutsideDays={true}
          selected={date}
          onSelect={setDate}
          fromYear={1960}
          toYear={2050}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
export default DatePickerComponent;
