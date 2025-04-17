import React from 'react';

interface GrayContainerProps {
  title?: string;
  subTitle?: string;
  titleButton?: React.ReactNode;
  children: React.ReactNode;
}

const GrayContainer: React.FC<GrayContainerProps> = ({
  title,
  subTitle,
  titleButton,
  children,
}) => {
  return (
    <div className="mb-4 rounded-lg bg-gray-100 p-4">
      <div className="flex flex-row items-center justify-between">
        <div className="">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-md font-normal text-gray-500">{subTitle}</p>
        </div>
        {titleButton}
      </div>
      <div className="mt-4 h-auto bg-gray-100">{children}</div>
    </div>
  );
};

export default GrayContainer;
