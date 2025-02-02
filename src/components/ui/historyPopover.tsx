import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const HistoryPopover = PopoverPrimitive.Root;

const HistoryPopoverTrigger = PopoverPrimitive.Trigger;

interface HistoryGroup {
  date: string;
  items: string[];
}

const HistoryPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    historyGroups: HistoryGroup[];
  }
>(
  (
    { className, historyGroups, align = 'center', sideOffset = 4, ...props },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 relative w-[29.5rem] max-h-[300px] border border-neutral-200 bg-white text-neutral-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
          className,
        )}
        {...props}>
        <div className="flex flex-col h-[300px]">
          <div className="px-6 py-5 flex-shrink-0">
            <h2 className="text-subtitle2 font-bold">히스토리</h2>
          </div>
          <ScrollArea className="flex-1" variant="mini">
            <div className="px-6">
              {historyGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="py-4 border-b border-graysclae-10 flex gap-3 w-full">
                  <h3 className="text-body2 font-normal text-primary-60 shrink-0 w-24">
                    {group.date}
                  </h3>
                  <ul className="space-y-4 flex flex-col flex-1 min-w-0">
                    {group.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-grayscale-90 font-medium text-body1 break-words">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="px-6 py-5 flex-shrink-0">
            <div className="flex justify-end">
              <PopoverPrimitive.Close>
                <Button variant="primary" size="md">
                  닫기
                </Button>
              </PopoverPrimitive.Close>
            </div>
          </div>
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  ),
);
HistoryPopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { HistoryPopover, HistoryPopoverContent, HistoryPopoverTrigger };
