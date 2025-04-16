import { cn } from '@/lib/utils';
import React from 'react';

interface TabContentContainerProps {
  className?: string;
  children: React.ReactNode;
}

const TabContentContainer: React.FC<TabContentContainerProps> = ({
  className = '',
  children,
}) => {
  return (
    <div className={cn('mb-20 h-auto w-full px-10 pt-8', className)}>
      {children}
    </div>
  );
};

export default TabContentContainer;
