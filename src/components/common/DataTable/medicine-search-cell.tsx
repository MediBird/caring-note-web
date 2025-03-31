import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useSearchMedicationByKeyword } from '@/pages/Consult/hooks/query/useSearchMedicationByKeyword';
import { Row } from '@tanstack/react-table';
import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MedicineSearchCellProps<T extends { id: string }> {
  row: Row<T>;
  value: string;
  handleSearchEnter: (
    id: string,
    medicationId: string,
    medicationName: string,
  ) => void;
}

function MedicineSearchCell<T extends { id: string }>({
  row,
  value,
  handleSearchEnter,
}: MedicineSearchCellProps<T>) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const debouncedInputValue = useDebounce(inputValue, 300);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  const { data: searchMedicationByKeywordList } =
    useSearchMedicationByKeyword(debouncedInputValue);

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
      handleSearchEnter(row.original.id, '', '');
    } else {
      handleSearchEnter(row.original.id, '', inputValue);
    }
  };

  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover open={open}>
      <div ref={popoverRef} className="h-full">
        <PopoverTrigger
          asChild
          ref={triggerRef}
          className="h-full content-center rounded-[8px] border-none bg-transparent data-[state=open]:bg-white data-[state=open]:shadow-cell-shadow">
          {open ? (
            <div className="h-full w-full">
              <Input
                type="text"
                placeholder="이름을 입력해 주세요"
                value={inputValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="h-full truncate border-none bg-transparent"
              />
            </div>
          ) : (
            <div className="h-full w-full cursor-pointer" onClick={handleFocus}>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'flex h-full w-full items-center justify-start truncate border-t border-transparent bg-transparent px-3 py-2 text-base leading-4',
                        inputValue === '' && 'text-grayscale-30',
                      )}>
                      <p className="truncate">
                        {inputValue === ''
                          ? '이름을 입력해 주세요'
                          : inputValue}
                      </p>
                    </div>
                  </TooltipTrigger>
                  {inputValue !== '' && (
                    <TooltipContent
                      side="bottom"
                      align="start"
                      sideOffset={4}
                      collisionPadding={20}
                      className="max-w-[400px] break-words">
                      {inputValue}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          avoidCollisions={false}
          style={{ width: triggerRef.current?.offsetWidth }}
          className="min-w-[200px] rounded-[8px] p-2 font-medium text-grayscale-100">
          <div className="relative flex max-h-[304px] flex-col gap-2 overflow-y-auto">
            {searchMedicationByKeywordList &&
            searchMedicationByKeywordList.length > 0 ? (
              searchMedicationByKeywordList.map((item) => (
                <div
                  onClick={() => {
                    handleSearchEnter(
                      row.original.id,
                      item.id as string,
                      item.itemName as string,
                    );
                  }}
                  key={item.id}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-sm p-1 hover:bg-grayscale-5',
                    item.itemName === value && 'text-primary-50',
                  )}>
                  {item.itemName}
                  {item.itemName === value && (
                    <Check className="h-4 w-4 text-primary-50" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-2">
                <div className="font-medium text-grayscale-40">
                  검색 결과가 없습니다.
                </div>
                {inputValue && (
                  <div
                    onClick={() => {
                      handleSearchEnter(row.original.id, '', inputValue);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-sm p-1 text-primary-50 hover:bg-grayscale-5">
                    <span>"{inputValue}" 직접 입력하기</span>
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}

export default MedicineSearchCell;
