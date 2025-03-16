import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ButtonGroupOption {
  value: string;
  label: string;
}

interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string | string[];
  onChange: (value: string) => void;
  className?: string;
  multiple?: boolean;
}

export function ButtonGroup({
  options,
  value,
  onChange,
  className,
  multiple = false,
}: ButtonGroupProps) {
  const values = multiple
    ? Array.isArray(value)
      ? value
      : value.split(',').filter(Boolean)
    : [value];

  return (
    <div className={cn('flex gap-2 rounded-md', className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={values.includes(option.value) ? 'tertiary' : 'nonpressed'}
          className="font-medium"
          onClick={() => onChange(option.value)}>
          {option.label}
        </Button>
      ))}
    </div>
  );
}
