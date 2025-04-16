import classNames from 'classnames';
import React from 'react';

interface SampleComponentProps {
  _class?: string;
  children: React.ReactNode;
}

const SampleComponent: React.FC<SampleComponentProps> = ({
  _class = '',
  children,
}) => {
  return <div className={classNames('', _class)}>{children}</div>;
};

export default SampleComponent;
