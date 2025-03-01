import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TableFilterDateProps {
  title: string;
  onSelectionChange: (dates: Date[]) => void;
  selectedDates?: Date[];
  enabledDates?: string[];
  isLoading?: boolean;
}

const TableFilterDate = ({
  title,
  onSelectionChange,
  selectedDates: externalSelectedDates,
  enabledDates,
}: TableFilterDateProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    externalSelectedDates || [],
  );
  const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>(
    externalSelectedDates || [],
  );
  const [month, setMonth] = useState<Date>(new Date());

  const isDateSelected = (date: Date): boolean => {
    return tempSelectedDates.some(
      (selectedDate) =>
        format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'),
    );
  };

  const isDateEnabled = (date: Date): boolean => {
    if (!enabledDates || enabledDates.length === 0) return true;
    return enabledDates.includes(format(date, 'yyyy-MM-dd'));
  };

  const handleDateSelect = (date: Date) => {
    if (isDateSelected(date)) {
      setTempSelectedDates((prev) =>
        prev.filter(
          (selectedDate) =>
            format(selectedDate, 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd'),
        ),
      );
    } else {
      setTempSelectedDates((prev) => [...prev, date]);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTempSelectedDates(selectedDates);
    } else {
      setSelectedDates(tempSelectedDates);
      onSelectionChange(tempSelectedDates);
    }
  };

  const handleClear = () => {
    setTempSelectedDates([]);
    setSelectedDates([]);
    onSelectionChange([]);
  };

  const renderSelectedContent = () => {
    if (selectedDates.length === 0) return null;
    if (selectedDates.length > 2) {
      return <Badge variant="secondary">{selectedDates.length}개 선택</Badge>;
    }
    return selectedDates.map((date) => (
      <Badge key={format(date, 'yyyy-MM-dd')} variant="secondary">
        {format(date, 'yyyy.MM.dd')}
      </Badge>
    ));
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={open ? 'tertiary' : 'outline'}
          role="combobox"
          size="lg"
          aria-expanded={open}
          className="flex items-center gap-2">
          <ChevronDown className="h-4 w-4" />
          <span>{title}</span>
          {selectedDates.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex gap-1">{renderSelectedContent()}</div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <Calendar
            mode="multiple"
            captionLayout="dropdown-buttons"
            showOutsideDays={true}
            selected={tempSelectedDates}
            onDayClick={handleDateSelect}
            month={month}
            onMonthChange={setMonth}
            locale={ko}
            disabled={(date) => !isDateEnabled(date)}
            className="border-none"
          />
          {tempSelectedDates.length > 0 && (
            <Button
              variant="ghost"
              className="mt-4 w-full text-sm"
              onClick={handleClear}>
              날짜 필터 초기화
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableFilterDate;
