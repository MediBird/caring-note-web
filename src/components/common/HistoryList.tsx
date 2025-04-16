import React from 'react';

interface HistoryListProps {
  date: string;
  items: string[];
}

const HistoryList: React.FC<HistoryListProps> = ({ date, items }) => {
  return (
    <div className="mb-4 w-full border-b border-grayscale-5">
      <div className="mr-4 inline-block w-auto align-top">
        <span className="text-body text-primary-60">{date}</span>
      </div>
      <div className="inline-block max-w-xs">
        {items.map((item, index) => (
          <p
            key={index}
            className="pb-4 text-body1 font-medium text-grayscale-90">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
