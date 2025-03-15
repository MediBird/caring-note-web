import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'line-clamp-1 flex h-10 w-full rounded-md border border-grayscale-30 px-3 py-2 text-base font-medium focus:border-primary-50 focus:outline-none focus:ring-0 focus:ring-offset-0',
          disabled ? 'border-grayscale-10 bg-grayscale-5' : 'bg-white',
          className,
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
