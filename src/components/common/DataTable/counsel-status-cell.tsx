import { AddCounselSessionReqStatusEnum } from '@/api/api';
import { cn } from '@/lib/utils';

interface CounselStatusCellProps {
  status: AddCounselSessionReqStatusEnum;
}

const counselSessionStatus = {
  COMPLETED: '완료',
  SCHEDULED: '예정',
  PROGRESS: '진행',
  CANCELED: '취소',
};

const CounselStatusCell = ({ status }: CounselStatusCellProps) => {
  const getCounselSessionStatusColor = (status: string): string => {
    switch (status) {
      case AddCounselSessionReqStatusEnum.Completed:
        return 'text-grayscale-100';
      case AddCounselSessionReqStatusEnum.Scheduled:
        return 'text-grayscale-50';
      case AddCounselSessionReqStatusEnum.Progress:
        return 'text-primary-50';
      case AddCounselSessionReqStatusEnum.Canceled:
        return 'text-error-50';
      default:
        return 'text-black';
    }
  };

  const statusLabel =
    counselSessionStatus[status as keyof typeof counselSessionStatus];

  return (
    <span className={cn('px-3', getCounselSessionStatusColor(status))}>
      {statusLabel}
    </span>
  );
};

export default CounselStatusCell;
