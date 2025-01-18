import classNames from 'classnames';
import React from 'react';

interface TabTitleProps {
  className?: string;
  text: string;
}

const TabContentTitle: React.FC<TabTitleProps> = ({ className = '', text }) => {
  return (
    <div className={classNames('mt-2 mb-6 text-grayscale-90', className)}>
      <span className="text-subtitle1 font-bold ">{text}</span>
    </div>
  );
};

export default TabContentTitle;
