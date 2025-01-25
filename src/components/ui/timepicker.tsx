import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
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
  // 시간 생성
  const times = Array.from({ length: 24 * 60 }, (_, i) => {
    const hour = Math.floor(i / 60)
      .toString()
      .padStart(2, '0');
    const minute = (i % 60).toString().padStart(2, '0');
    return `${hour}:${minute}`;
  });

  // 선택한 날짜 및 시간 처리
  const handleSelect = (value: string) => {
    setTime(value);

    // 날짜 및 시간 선택 시, 선택한 날짜 및 시간을 부모 컴포넌트로 전달

    handleClicked?.(value as string);
  };
  return (
    <div className={className}>
      <Select value={time || ''} onValueChange={(value) => handleSelect(value)}>
        <SelectTrigger className="flex w-full gap-2 text-base text-left justify-normal h-[36px]">
          <CalendarIcon className="w-4 h-4 mr-0" />
          <SelectValue
            placeholder={placeholder || time}
            className="justify-between w-full"
          />
        </SelectTrigger>
        <SelectContent className="w-full">
          {times.map((timeOption) => (
            <SelectItem key={timeOption} value={timeOption}>
              {timeOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
export default TimepickerComponent;
