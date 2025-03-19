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
  initialTime?: string;
}

const TimepickerComponent = ({
  placeholder,
  className,
  handleClicked,
  initialTime,
}: TimePickerProps) => {
  const [time, setTime] = useState<string>(initialTime || '');
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 08:00부터 22:00까지 30분 단위로 시간 생성 (22:30 제외)
  const times = Array.from({ length: (22 - 8) * 2 + 1 }, (_, i) => {
    const hour = (Math.floor(i / 2) + 8).toString().padStart(2, '0');
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
      const targetTime = time;

      // 더 긴 지연 시간을 사용하여 컴포넌트가 완전히 렌더링될 시간을 확보
      setTimeout(() => {
        // 선택자를 직접 사용하여 스크롤 가능한 컨테이너 찾기
        const scrollContainer = document.querySelector(
          '.select-content .overflow-y-auto',
        );
        const targetElement = document.querySelector(
          `.select-content [data-value="${targetTime}"]`,
        );

        if (scrollContainer && targetElement) {
          // 스크롤을 목표 요소로 이동
          const containerRect = scrollContainer.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();

          // 스크롤 컨테이너 내에서 요소의 상대적 위치 계산
          const relativePosition = targetRect.top - containerRect.top;

          // 스크롤 컨테이너의 중앙에 요소가 오도록 스크롤 위치 조정
          scrollContainer.scrollTop =
            relativePosition - containerRect.height / 2 + targetRect.height / 2;
        }
      }, 100);
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
            (time || initialTime) && '!text-grayscale-90',
            open && 'border-primary-50 ring-1 ring-primary-50',
          )}>
          <SelectValue
            placeholder={placeholder || time}
            className="w-full justify-between"
          />
        </SelectTrigger>
        <SelectContent ref={scrollRef} className="select-content w-full">
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
