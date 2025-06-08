import React from 'react';
import { cn } from '@/lib/utils';

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'destructive';
  className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  children,
  variant = 'default',
  className,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-10';
      case 'secondary':
        return 'bg-secondary-10';
      case 'accent':
        return 'bg-error-10';
      default:
        return 'bg-grayscale-5';
    }
  };

  return (
    <div>
      <h2 className="text-foreground mb-4 text-xl font-bold">{title}</h2>
      <div
        className={cn(
          'space-y-4 rounded-lg border p-2',
          getVariantStyles(),
          className,
        )}>
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
};

export default SectionContainer;
