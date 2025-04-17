import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-visible rounded-md',
      'bg-grayscale-80',
      'text-caption1 font-medium text-white',
      'relative px-2 py-1 shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      'before:absolute before:content-[""]',
      'before:h-2 before:w-2 before:rotate-45 before:bg-grayscale-80',
      'data-[side=bottom]:before:-top-1 data-[side=bottom]:before:left-1/2 data-[side=bottom]:before:-translate-x-1/2',
      'data-[side=top]:before:-bottom-1 data-[side=top]:before:left-1/2 data-[side=top]:before:-translate-x-1/2',
      'data-[side=left]:before:-right-1 data-[side=left]:before:top-1/2 data-[side=left]:before:-translate-y-1/2',
      'data-[side=right]:before:-left-1 data-[side=right]:before:top-1/2 data-[side=right]:before:-translate-y-1/2',
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
