import classNames from 'classnames';
import React from 'react';

interface ConsultCardContainerProps {
  _class?: string;
  title?: React.ReactElement;
  children: React.ReactNode;
}

const ConsultCardContainer: React.FC<ConsultCardContainerProps> = ({
  _class = '',
  title = null,
  children,
}) => {
  return (
    <div className={classNames('w-full', _class)}>
      <div className="rounded-t-lg"></div>
      <div className="flex items-center justify-between">
        <div className="px-2 py-2">{title}</div>
        {children}
      </div>
    </div>
  );
};

export default ConsultCardContainer;
