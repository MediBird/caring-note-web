import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import Warning from '@/assets/icon/20/warning.filled.red.svg?react';

export interface FormInputProps extends React.ComponentProps<'input'> {
  validation?: (value: string) => string | null;
  showValidationOnBlur?: boolean;
  className?: string;
}

export const FormInput = ({
  validation,
  showValidationOnBlur = true,
  className,
  ...props
}: FormInputProps) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (showValidationOnBlur && validation) {
      const validationResult = validation(e.target.value);
      setError(validationResult);
    }
    setTouched(true);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (touched && validation) {
      const validationResult = validation(e.target.value);
      setError(validationResult);
    }
    props.onChange?.(e);
  };

  useEffect(() => {
    if (props.disabled) {
      setError(null);
    }
  }, [props.disabled]);

  return (
    <div className="relative w-full">
      <Input
        className={cn(error && 'border-red-500', className)}
        {...props}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {error && (
        <div className="absolute right-2.5 top-2.5">
          <Warning />
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
