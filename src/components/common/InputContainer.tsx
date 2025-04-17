import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface InputContainerProps {
  className?: string;
  children?: ReactNode;
}

const InputContainer: React.FC<InputContainerProps> = ({
  className,
  children,
}) => {
  return (
    <div className={classNames('mr-4 flex items-center space-x-2', className)}>
      {children}
    </div>
  );
};

export default InputContainer;
