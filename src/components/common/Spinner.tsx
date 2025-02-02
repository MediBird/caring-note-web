import { cn } from '@/lib/utils';
import React from 'react';

interface SpinnerProps {
  className?: string;
}
const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'mt-4 animate-spin rounded-full border-2 border-primary-50',
        className,
      )}
      style={{
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        width: '36px',
        height: '36px',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
};

export default Spinner;
