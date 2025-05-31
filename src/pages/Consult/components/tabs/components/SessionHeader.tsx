import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface SessionHeaderProps {
  sessionNumber?: number;
  counselSessionDate?: string;
  counselorName?: string;
  isOpen: boolean;
  onViewDetails: () => void;
}

const SessionHeader = ({
  sessionNumber,
  counselSessionDate,
  counselorName,
  isOpen,
  onViewDetails,
}: SessionHeaderProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex items-center justify-between rounded-lg p-4 hover:bg-primary-10">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary-50"></div>
        <span className="text-subtitle1 font-semibold">
          {sessionNumber}회차
        </span>
        <span className="text-body1 font-normal text-grayscale-60">
          {formatDate(counselSessionDate)} | {counselorName} 약사
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="border-primary-60 text-body1 font-normal text-primary-60 hover:bg-primary-5">
          자세히 보러 가기
        </Button>
        {isOpen ? (
          <Button variant="secondary" size="lg">
            <ChevronDownIcon className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="secondary" size="lg">
            <ChevronUpIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionHeader;
