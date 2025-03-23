import TooltipBlackIcon from '@/assets/icon/20/info.filled.svg?react';
import { cn } from '@/lib/utils';
import React from 'react';
import { PlacesType, Tooltip as ReactTooltip } from 'react-tooltip';

interface TooltipProps {
  className?: string;
  id: string;
  text: string;
  eventType?: 'hover' | 'click';
  place?: PlacesType;
}

const Tooltip: React.FC<TooltipProps> = ({
  className,
  id,
  text,
  eventType = 'hover',
  place = 'bottom-end',
}) => {
  return (
    <>
      <div className={cn(`inline-block m-1 text-gray-900`, className)}>
        <TooltipBlackIcon width={20} height={20} data-tooltip-id={id} />
      </div>
      <ReactTooltip
        className="bg-grayscale-10 !p-1 !px-2 !fixed !rounded-[4px] !font-normal"
        id={id}
        place={place}
        content={text}
        openEvents={{
          click: eventType === 'click',
          mouseover: eventType === 'hover',
        }}
        closeEvents={{
          click: eventType === 'click',
          mouseout: eventType === 'hover',
        }}
      />
    </>
  );
};

export default Tooltip;
