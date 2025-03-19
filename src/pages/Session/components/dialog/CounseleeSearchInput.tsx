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
import SearchIcon from '@/assets/icon/24/search.outline.black.svg?react';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTriggerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <Popover open={open}>
      <div ref={popoverRef} className="h-full">
        <PopoverTrigger
          asChild
          ref={triggerRef}
          onClick={handleTriggerClick}
          className="!h-10 content-center rounded border border-grayscale-30 bg-transparent focus:outline-none data-[state=open]:border-transparent data-[state=open]:shadow-cell-shadow data-[state=open]:ring-1 data-[state=open]:ring-primary-50">
          <div className="flex h-full w-full items-center gap-2 p-1">
            <SearchIcon className="h-6 w-6" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="내담자 이름"
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                'h-full border-none p-0',
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
          className="min-w-[200px] rounded-[8px] p-2 font-medium text-grayscale-100">
          <div className="relative flex max-h-[304px] flex-col gap-2 overflow-y-auto">
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
                    'flex cursor-pointer flex-col rounded-sm p-1 hover:bg-grayscale-5',
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
              <div className="font-medium text-grayscale-40">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}
