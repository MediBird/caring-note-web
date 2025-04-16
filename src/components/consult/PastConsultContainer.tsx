import React from 'react';

interface PastConsultContainerProps {
  variant: 'primary' | 'secondary';
  title: string;
  children?: React.ReactNode;
}

const PastConsultContainer: React.FC<PastConsultContainerProps> = ({
  variant,
  title,
  children,
}) => {
  return (
    <div
      className={`min-h-80 w-1/2 rounded-lg border border-${variant}-30 mb-10`}>
      <div className={`bg-${variant}-10 rounded-t-lg p-4`}>
        <h2
          className={`text-subtitle2 font-bold text-${variant}-70 flex items-center`}>
          {title}
        </h2>
      </div>
      <div className="h-64 overflow-y-auto px-4 pb-4">{children}</div>
    </div>
  );
};

export default PastConsultContainer;
