import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'peer aspect-square h-4 w-4 rounded-full border-[2.29px] border-grayscale-50 bg-white text-grayscale-90', // base
        'hover:border-grayscale-70 active:border-grayscale-90 disabled:cursor-not-allowed disabled:border-grayscale-30', // unselected
        'data-[state=checked]:border-primary-50 data-[state=checked]:bg-primary-50', // selected
        'data-[state=checked]:hover:border-primary-60 data-[state=checked]:hover:bg-primary-60', // selected:hover
        'data-[state=checked]:active:border-primary-70 data-[state=checked]:active:bg-primary-70', // selected:active(pressed)
        'dark:border-neutral-50 dark:text-neutral-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
        className,
      )}
      {...props}>
      <RadioGroupPrimitive.Indicator className="relative flex h-full w-full items-center justify-center">
        <Circle className="h-1.5 w-1.5 fill-white stroke-none" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
