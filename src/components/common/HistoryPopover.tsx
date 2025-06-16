import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeRecordedResObject } from '@/api';
import HistoryList from './HistoryList';
import { Button } from '../ui/button';

interface HistoryPopoverProps {
  historyData: TimeRecordedResObject[];
  isLoading?: boolean;
  hasData?: boolean;
  formatHistoryItem?: (data: unknown) => string[];
  className?: string;
}

const HistoryPopover: React.FC<HistoryPopoverProps> = ({
  historyData,
  isLoading = false,
  hasData = false,
  formatHistoryItem,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const defaultFormatHistoryItem = (data: unknown): string[] => {
    if (typeof data === 'string') {
      return [data];
    }
    if (typeof data === 'object' && data !== null) {
      return [JSON.stringify(data, null, 2)];
    }
    return ['데이터 없음'];
  };

  // 데이터가 없으면 비활성화된 아이콘만 표시
  if (!hasData) {
    return (
      <History
        className={cn(
          'h-6 w-6 cursor-not-allowed rounded-lg bg-grayscale-5 p-[2px] text-grayscale-40',
          className,
        )}
      />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <History
          className={cn(
            'text-primary hover:text-primary/80 h-6 w-6 cursor-pointer rounded-lg bg-grayscale-5 p-[2px]',
            className,
          )}
        />
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start" side="bottom">
        <div className="flex max-h-[480px] flex-col">
          <div className="flex flex-shrink-0 items-center justify-between px-6 py-5">
            <h2 className="text-subtitle2 font-bold">히스토리</h2>
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              size="icon"
              className="h-6 w-6">
              <X />
            </Button>
          </div>
          <ScrollArea className="flex-1" variant="mini">
            <div className="px-6">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-grayscale-60">
                    히스토리를 불러오는 중...
                  </div>
                </div>
              ) : historyData.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-grayscale-60">
                    이전 히스토리가 없습니다.
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  {historyData.map((item, index) => (
                    <HistoryList
                      key={index}
                      date={formatDate(item.counselDate || '')}
                      items={
                        formatHistoryItem
                          ? formatHistoryItem(item.data)
                          : defaultFormatHistoryItem(item.data)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HistoryPopover;
