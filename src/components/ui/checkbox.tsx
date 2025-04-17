import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded-[5px] border-[2.5px] border-grayscale-40 bg-white', // base
      'hover:border-grayscale-60 active:border-grayscale-70 disabled:cursor-not-allowed disabled:border-grayscale-30', // unchecked
      'data-[state=checked]:border-primary-50 data-[state=checked]:bg-primary-50 data-[state=checked]:text-white', // checked
      'data-[state=checked]:hover:border-primary-60 data-[state=checked]:hover:bg-primary-60', // checked:hover
      'data-[state=checked]:active:border-primary-70 data-[state=checked]:active:bg-primary-70', // checked:active(pressed)
      'dark:border-neutral-800 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 dark:data-[state=checked]:bg-neutral-50 dark:data-[state=checked]:text-neutral-900',
      className,
    )}
    {...props}>
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center')}>
      <Check className="h-4 w-4" strokeWidth={3.5} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
