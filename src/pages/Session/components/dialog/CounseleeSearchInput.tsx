import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useCounseleeAutocomplete } from '../../hooks/query/useCounseleeAutocomplete';

interface CounseleeSearchInputProps {
  value: string;
  selectedId: string;
  onChange: (counseleeId: string, counseleeName: string) => void;
  forceClose?: boolean;
}

export default function CounseleeSearchInput({
  value,
  selectedId,
  onChange,
  forceClose = false,
}: CounseleeSearchInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const debouncedInputValue = useDebounce(inputValue, 300);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceClose) {
      setOpen(false);
    }
  }, [forceClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data: counseleeList = [] } =
    useCounseleeAutocomplete(debouncedInputValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (e.relatedTarget?.closest('[role="dialog"]')) {
      return;
    }
    setOpen(false);

    if (inputValue === '') {
      onChange('', '');
    }
  };

  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover open={open}>
      <div ref={popoverRef} className="h-full">
        <PopoverTrigger
          asChild
          ref={triggerRef}
          className="data-[state=open]:shadow-cell-shadow border-none content-center rounded-[8px] bg-transparent data-[state=open]:bg-white h-full">
          <div className="w-full h-full">
            <Input
              type="text"
              placeholder="내담자 이름을 입력해 주세요"
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                'h-full',
                open && 'border-primary-50 focus:border-primary-50',
              )}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          avoidCollisions={false}
          style={{ width: triggerRef.current?.offsetWidth }}
          className="min-w-[200px] rounded-[8px] p-2 text-grayscale-100 font-medium">
          <div className="relative flex flex-col gap-2 max-h-[304px] overflow-y-auto">
            {counseleeList && counseleeList.length > 0 ? (
              counseleeList.map((item) => (
                <div
                  onClick={() => {
                    setInputValue(item.name || '');
                    onChange(item.counseleeId || '', item.name || '');
                    setOpen(false);
                  }}
                  key={item.counseleeId}
                  className={cn(
                    'hover:bg-grayscale-5 p-1 rounded-sm flex flex-col cursor-pointer',
                    item.counseleeId === selectedId && 'text-primary-50',
                  )}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.birthDate && (
                    <span className="text-xs text-grayscale-60">
                      {item.birthDate}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-grayscale-40 font-medium">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}
