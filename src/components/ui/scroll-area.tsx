import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    variant?: 'main' | 'mini';
  }
>(({ className, children, variant = 'main', ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar variant={variant} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > & {
    variant?: 'main' | 'mini';
  }
>(
  (
    { className, orientation = 'vertical', variant = 'main', ...props },
    ref,
  ) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' &&
          variant === 'main' &&
          'h-full w-2 border-l border-l-transparent p-[1px]',
        orientation === 'vertical' &&
          variant === 'mini' &&
          'h-full w-1 border-l border-l-transparent p-[1px]',
        className,
      )}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn(
          'relative rounded-full',
          variant === 'main' && 'flex w-[8px] bg-grayscale-70',
          variant === 'mini' && 'flex w-[4px] bg-primary-40',
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  ),
);
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
