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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  palaceholder?: string;
  className?: string;
  initialDate?: Date;
  selectionType?: 'date' | 'time';
  handleClicked?: (value?: string) => void;
}

export function DatePickerComponent({
  palaceholder,
  className,
  initialDate,
  selectionType,
  handleClicked,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [time, setTime] = React.useState<string | undefined>();
  const [isOpen, setIsOpen] = React.useState(false); // Popover 열림 상태 관리

  // 시간 생성
  const times = Array.from({ length: 24 * 60 }, (_, i) => {
    const hour = Math.floor(i / 60)
      .toString()
      .padStart(2, '0');
    const minute = (i % 60).toString().padStart(2, '0');
    return `${hour}:${minute}`;
  });

  // 선택한 날짜 및 시간 처리
  const handleSelect = (value: string | Date, type: 'date' | 'time') => {
    if (type === 'date' && value instanceof Date) {
      setDate(value);
    } else if (type === 'time' && typeof value === 'string') {
      setTime(value);
    }

    // 날짜 및 시간 선택 시, 선택한 날짜 및 시간을 부모 컴포넌트로 전달
    if (selectionType === 'date' && type === 'date') {
      handleClicked?.(format(value as Date, 'yyyy-MM-dd'));
      setIsOpen(false);
    } else if (selectionType === 'time' && type === 'time') {
      handleClicked?.(value as string);
      setIsOpen(false);
    }
  };

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
          {selectionType === 'date' && date ? (
            format(date, 'yyyy-MM-dd')
          ) : selectionType === 'time' && time ? (
            time
          ) : (
            <span>{palaceholder ? palaceholder : '날짜 및 시간 선택'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-4"
        onMouseDown={(e) => e.preventDefault()}>
        {selectionType === 'date' && (
          <Calendar
            mode="single"
            captionLayout="dropdown-buttons"
            showOutsideDays={true}
            selected={date}
            onSelect={(selectedDate) =>
              selectedDate && handleSelect(selectedDate, 'date')
            }
            fromYear={1960}
            toYear={2050}
            initialFocus
          />
        )}
        {selectionType === 'time' && (
          <div className="mt-4">
            <Select
              value={time || ''}
              onValueChange={(value) => handleSelect(value, 'time')}>
              <SelectTrigger className="w-full">
                <SelectContent className="w-full">
                  {times.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption}>
                      {timeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
                <SelectValue placeholder={palaceholder || time}></SelectValue>
              </SelectTrigger>
            </Select>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default DatePickerComponent;
