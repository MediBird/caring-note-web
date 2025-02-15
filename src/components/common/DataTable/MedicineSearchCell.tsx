import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSearchMedicationByKeyword } from '@/pages/Consult/hooks/query/useSearchMedicationByKeyword';
import { useDebounce } from '@/hooks/useDebounce';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Row } from '@tanstack/react-table';

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
          className="data-[state=open]:shadow-cell-shadow content-center rounded-[8px] bg-transparent data-[state=open]:bg-white h-full">
          <div className="w-full h-full">
            <Input
              type="text"
              placeholder="이름을 입력해 주세요"
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="bg-transparent h-full truncate"
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
                    'hover:bg-grayscale-5 p-1 rounded-sm flex justify-between items-center cursor-pointer line-clamp-1',
                    item.itemName === value && 'text-primary-50',
                  )}>
                  {item.itemName}
                  {item.itemName === value && (
                    <Check className="h-4 w-4 text-primary-50" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-grayscale-40 font-medium">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
          {/* {searchMedicationByKeywordList &&
            searchMedicationByKeywordList?.length > 5 && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[50px] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 100%)',
                }}
              />
            )} */}
        </PopoverContent>
      </div>
    </Popover>
  );
}

export default MedicineSearchCell;
