import React from "react";

interface HistoryListProps {
  date: string;
  items: string[];
}

const HistoryList: React.FC<HistoryListProps> = ({ date, items }) => {
  return (
    <div className="w-full mb-4 border-b border-grayscale-5">
      <div className="w-auto inline-block align-top mr-4">
        <span className="text-body text-primary-60">{date}</span>
      </div>
      <div className="inline-block max-w-xs">
        {items.map((item, index) => (
          <p
            key={index}
            className="text-body1 font-medium text-grayscale-90 pb-4">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
