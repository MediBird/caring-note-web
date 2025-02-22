import * as React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface ButtonGroupOption {
  value: string;
  label: string;
}

interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ButtonGroup({
  options,
  value,
  onChange,
  className,
}: ButtonGroupProps) {
  return (
    <div className={cn('flex rounded-md gap-2', className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? 'tertiary' : 'nonpressed'}
          className="font-medium"
          onClick={() => onChange(option.value)}>
          {option.label}
        </Button>
      ))}
    </div>
  );
}
