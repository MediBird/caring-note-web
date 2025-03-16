import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export interface TimePickerProps {
  placeholder?: string;
  className?: string;
  handleClicked?: (value?: string) => void;
}

const TimepickerComponent = ({
  placeholder,
  className,
  handleClicked,
}: TimePickerProps) => {
  const [time, setTime] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const defaultTime = '12:00';
  const scrollRef = useRef<HTMLDivElement>(null);

  // 30분 단위로 시간 생성
  const times = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2)
      .toString()
      .padStart(2, '0');
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
  });

  // 선택한 날짜 및 시간 처리
  const handleSelect = (value: string) => {
    setTime(value);
    handleClicked?.(value as string);
  };

  // Select가 열릴 때 스크롤 위치 조정
  useEffect(() => {
    if (open && scrollRef.current) {
      const container = scrollRef.current.querySelector(
        '[data-radix-scroll-area-viewport]',
      );
      if (container) {
        const targetTime = time || defaultTime;
        const targetElement = scrollRef.current.querySelector(
          `[data-value="${targetTime}"]`,
        );

        if (targetElement) {
          // 스크롤을 목표 요소로 이동
          setTimeout(() => {
            targetElement.scrollIntoView({
              block: 'center',
              behavior: 'smooth',
            });
          }, 0);
        }
      }
    }
  }, [open, time]);

  return (
    <div className={className}>
      <Select
        value={time || ''}
        onValueChange={(value) => handleSelect(value)}
        open={open}
        onOpenChange={setOpen}>
        <SelectTrigger
          className={cn(
            'flex h-[42px] w-full justify-between gap-2 rounded border border-grayscale-30 text-left text-base font-medium text-grayscale-40 focus:border-grayscale-30',
            time && 'text-grayscale-90',
            open && 'border-primary-50 ring-1 ring-primary-50',
          )}>
          <SelectValue
            placeholder={placeholder || time}
            className="w-full justify-between"
          />
        </SelectTrigger>
        <SelectContent className="w-full" ref={scrollRef}>
          {times.map((timeOption) => (
            <SelectItem
              key={timeOption}
              value={timeOption}
              data-value={timeOption}>
              {timeOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimepickerComponent;
